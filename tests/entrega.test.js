import { jest } from '@jest/globals';
import { calcularEntrega, calcularTaxaEntrega } from '../src/conversor.js';

describe('Calculador de Entregas - injeção de dependência', () => {
    let servicoMock;

    beforeEach(() => {
        servicoMock = {
            obterValorPorKm: jest.fn(),
        };
    });

    it('Deve calcular corretamente o valor da entrega', async () => {
        servicoMock.obterValorPorKm.mockResolvedValue(2.5);

        const resultado = await calcularEntrega(8, servicoMock);

        expect(resultado).toBe(20);
    });

    it('deve rejeitar com erro quando o servico externo falhar', async () => {
        servicoMock.obterValorPorKm.mockRejectedValue(new Error('Erro no serviço externo'));

        await expect(calcularEntrega(8, servicoMock)).rejects.toThrow('Erro no serviço externo');
    });

    it('deve rejeitar se a distancia for uma distância inválida (0 por exemplo), 0 ou qualquer número menor que 0', async () => {
        await expect(calcularEntrega(0, servicoMock)).rejects.toThrow('Distância inválida');
        await expect(calcularEntrega(-5, servicoMock)).rejects.toThrow('Distância inválida');
        await expect(calcularEntrega('dezenove', servicoMock)).rejects.toThrow('Distância inválida');
    });

    it('deve rejeitar quando nenhum serviço for informado', async () => {
        await expect(calcularEntrega(8)).rejects.toThrow('Serviço de entrega não informado');
    });

    it('deve chamar o serviço sem argumentos e exatamente uma vez', async () => {
        servicoMock.obterValorPorKm.mockResolvedValue(2.5);

        await calcularEntrega(8, servicoMock);

        expect(servicoMock.obterValorPorKm).toHaveBeenCalledTimes(1);
        expect(servicoMock.obterValorPorKm).toHaveBeenCalledWith();
    });

    it('não deve chamar o serviço externo para distâncias menores ou iguais a 5', async () => {
        const resultado = await calcularTaxaEntrega(5, servicoMock);

        expect(resultado).toBe(8);
        expect(servicoMock.obterValorPorKm).not.toHaveBeenCalled();
    });

    describe('Desafio', () => {
        it('deve calcular corretamente usando serviços com taxas distintas', async () => {
            const servicoNormal = {
                obterValorPorKm: jest.fn().mockResolvedValue(3.0),
            };

            const servicoPromocional = {
                obterValorPorKm: jest.fn().mockResolvedValue(1.5),
            };

            const valorNormal = await calcularEntrega(10, servicoNormal);
            const valorPromocional = await calcularEntrega(10, servicoPromocional);

            expect(valorNormal).toBe(30);
            expect(valorPromocional).toBe(15);
        });
    });
});
