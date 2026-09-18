import { jest } from '@jest/globals';
import { calcularEntrega, calcularTaxaEntrega } from '../src/entrega.js';

describe('Atividade 2 - Testes com Injeção de Dependência', () => {
    let servicoMock;

    beforeEach(() => {
        // isso aqui inicializa um mock para fazer os testes
        servicoMock = {
            obterValorPorKm: jest.fn(),
        };
    });

    // funcionando certinho
    it('deve calcular corretamente o valor da entrega para R$ 2,50 por km', async () => {
        servicoMock.obterValorPorKm.mockResolvedValue(2.5);

        const resultado = await calcularEntrega(10, servicoMock);

        expect(resultado).toBe(25);
    });

    // apresentando erro
    it('deve rejeitar a operação e apresentar o erro quando o serviço falhar', async () => {
        servicoMock.obterValorPorKm.mockRejectedValue(new Error('Erro no serviço externo'));

        await expect(calcularEntrega(10, servicoMock)).rejects.toThrow('Erro no serviço externo');
    });

    // testando com distância inválida
    it('deve rejeitar com "Distância inválida" para distâncias menores ou iguais a zero', async () => {
        await expect(calcularEntrega(0, servicoMock)).rejects.toThrow('Distância inválida');
        await expect(calcularEntrega(-5, servicoMock)).rejects.toThrow('Distância inválida');
    });

    // testando sem informar o serviço
    it('deve rejeitar com "Serviço de entrega não informado" quando nenhuma dependência for passada', async () => {
        await expect(calcularEntrega(10)).rejects.toThrow('Serviço de entrega não informado');
    });

    it('deve verificar se o serviço foi chamado uma vez e sem argumentos', async () => {
        servicoMock.obterValorPorKm.mockResolvedValue(2.5);

        await calcularEntrega(10, servicoMock);

        expect(servicoMock.obterValorPorKm).toHaveBeenCalledTimes(1);
        expect(servicoMock.obterValorPorKm).toHaveBeenCalledWith();
    });

    it('não deve consultar o serviço externo para distâncias <= 5 km e retornar a taxa fixa de R$ 10,00', async () => {
        const resultado = await calcularTaxaEntrega(4, servicoMock);

        expect(resultado).toBe(10);
        expect(servicoMock.obterValorPorKm).not.toHaveBeenCalled();
    });

    // desafio
    describe('Desafio de Injeção de Dependência', () => {
        it('deve calcular valores diferentes usando o serviço normal e o promocional', async () => {
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
