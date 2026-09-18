// Calcula o valor da entrega utilizando um serviço externo.
//
// O serviço é recebido como parâmetro.
// Nos testes, você deverá fornecer uma dependência falsa.

export async function calcularEntrega(distancia, servico) {
    if (typeof distancia !== 'number' || distancia <= 0) {
        throw new Error('Distância inválida');
    }

    if (!servico) {
        throw new Error('Serviço de entrega não informado');
    }

    // Consulta o valor por quilômetro no serviço externo.
    const valorPorKm = await servico.obterValorPorKm();

    // Calcula o valor bruto, com duas casas decimais
    return Number((distancia * valorPorKm).toFixed(2));
}

// Calcula a taxa de entrega.
//
// Se a distância for pequena, existe uma taxa fixa
// e o serviço externo não precisa ser consultado.

export async function calcularTaxaEntrega(distancia, servico) {
    if (typeof distancia !== 'number' || distancia <= 0) {
        throw new Error('Distância inválida');
    }

    if (distancia <= 5) {
        return 10;
    }

    const valorPorKm = await servico.obterValorPorKm();

    return Number((distancia * valorPorKm).toFixed(2));
}
