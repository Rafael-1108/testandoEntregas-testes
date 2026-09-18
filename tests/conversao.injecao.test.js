import { jest } from '@jest/globals';
import { converterMoeda, obterCotacao } from '../src/conversor.js';

describe('⚙️ Conversor de moedas - injeção de dependência', () => {
    it('deve converter usando o cliente HTTP injetado', async () => {
        const http = {
            // mockResolvedValue() faz o mock retornar uma Promise resolvida com o valor informado.
            get: jest.fn().mockResolvedValue({
                data: { rates: { BRL: 5.5 } },
            }),
        };
        const resultado = await converterMoeda(10, 'USD', 'BRL', http);
        expect(resultado).toBe(55);
        // toBeCalledTimes() verifica quantas vezes a função mock foi chamada.
        expect(http.get).toHaveBeenCalledTimes(1);
    });

    it('deve devolver o próprio valor quando as moedas são iguais (sem chamar a API)', async () => {
        const http = {
            get: jest.fn(),
        };
        const resultado = await converterMoeda(10, 'USD', 'USD', http);
        expect(resultado).toBe(10);
        // not.toHaveBeenCalled() verifica que a função NÃO foi chamada.
        expect(http.get).not.toHaveBeenCalled();
    });

    it('deve retornar a cotação quando a API responde com sucesso', async () => {
        const http = {
            get: jest.fn().mockResolvedValue({
                data: { rates: { BRL: 5.5 } },
            }),
        };
        // resolves verifica se a Promise foi resolvida e se o resultado é o valor esperado.
        await expect(obterCotacao('USD', 'BRL', http)).resolves.toBe(5.5);
    });

    // FALHA - o cliente HTTP rejeita
    it('deve rejeitar quando o cliente HTTP falha', async () => {
        const http = {
            // mockRejectedValue() faz o mock retornar uma Promise rejeitada, simulando uma falha na dependência externa.
            get: jest.fn().mockRejectedValue(new Error('timeout')),
        };
        // rejects verifica se a Promise foi rejeitada.
        await expect(converterMoeda(10, 'USD', 'BRL', http)).rejects.toThrow('timeout');
    });

    // FALHA - resposta sem a taxa
    it('deve rejeitar quando a resposta não traz a taxa', async () => {
        const http = {
            get: jest.fn().mockResolvedValue({
                data: { rates: {} },
            }),
        };
        await expect(obterCotacao('USD', 'BRL', http)).rejects.toThrow('indisponível');
    });
});
