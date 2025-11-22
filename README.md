<img width="350" height="350" alt="SPARK-logo" src="https://github.com/user-attachments/assets/85bfdff4-eaa7-48f8-9f5c-00f4ec38a611" />

Projeto: SPARK – Sistema Inteligente de Monitoramento de Energia

Área: Sistemas Embarcados e IoT
Equipe Responsável:

Identificação dos Envolvidos
Papel	Nome
Product Owner	João Paulo Oliveira
Scrum Master	João Paulo Oliveira
Stakeholders	Wesley Pecoraro, Fabiana Comandini, Paulo Netto, Luciano Trevisan, Júlio Melli, Márcio Marinho
Desenvolvedores Front-End	Bleddilyn Ferreira, Fernando Filho, Felipe Caetano, João Zeferino
Desenvolvedores Back-End	Bleddilyn Ferreira, João Oliveira
Full Stack	Bleddilyn Ferreira, João Oliveira
Designer	Bleddilyn Ferreira
DBA	João Oliveira

<h1> Contexto </h1>

A evolução da eletricidade acompanhou o desenvolvimento tecnológico da humanidade, passando de experimentos fundamentais realizados por cientistas como Franklin, Faraday, Tesla e Edison até chegar à era moderna, na qual a energia elétrica se tornou elemento central para a produção industrial, consumo doméstico e avanço digital.

Com a expansão industrial, cresceu também a preocupação com:

o alto consumo energético,

os custos provenientes do desperdício,

os impactos ambientais da geração não renovável.

A transição para fontes sustentáveis e o avanço da Indústria 4.0 permitiram a adoção de sistemas inteligentes, capazes de:

monitorar o consumo em tempo real,

detectar falhas ou irregularidades,

otimizar o uso de energia para reduzir custos e impactos ao meio ambiente.

Sensores, IoT e análise de dados passaram a ser ferramentas essenciais para empresas e setores que buscam eficiência operacional e gestão energética racional.

Nesse contexto surge o SPARK, um sistema embarcado desenvolvido com ESP32 e sensores de corrente e tensão, para permitir:

monitoramento contínuo do consumo,

acompanhamento visual por gráficos e indicadores,

geração de insights que auxiliam na tomada de decisões.

<h1> Objetivos do Projeto </h1>
<h3>Monitoramento de Consumo</h3>

Permitir que o usuário acompanhe, em tempo real, o consumo elétrico de equipamentos industriais ou domésticos.

<h3>Eficiência Energética</h3>

Apoiar a redução de desperdícios e o uso inteligente de energia, apresentando dados precisos e históricos de medição.

<h3>Autonomia para o Usuário</h3>

Oferecer um sistema simples, intuitivo e de acesso direto, sem necessidade de operações complexas ou equipamentos adicionais.

<h3>Interface Intuitiva</h3>

Disponibilizar gráficos e informações claras sobre consumo, facilitando a análise de desempenho energético.

<h3>Segurança e Personalização</h3>

Permitir cadastro, login e configurações personalizadas, garantindo acesso individualizado e armazenamento confiável dos dados coletados.

<h1> Descrição do Sistema </h1>
<h3>Funcionamento Geral</h3>

O SPARK utiliza:

Microcontrolador ESP32

Sensor de corrente SCT-013-00

Sensor de tensão ACS712

Esses componentes capturam os valores de consumo energético em tempo real e enviam os dados para o aplicativo, que processa e apresenta os resultados visualmente.

<h3>Tela Principal</h3>

O usuário insere o nome do equipamento monitorado.

O sistema identifica e coleta os dados via sensores.

Os resultados são apresentados em forma de:

informações capturadas,

tabela de valores,

gráfico de variação de corrente.

<h3>Ambiente do Aplicativo</h3>

Tela de cadastro e login obrigatório.

Configuração e personalização de parâmetros.

Manual do usuário para facilitar o uso.

Interface organizada e simples para leitura dos resultados.
