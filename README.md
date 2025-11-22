<p align="center">
  <img width="350" height="350" alt="SPARK-logo" src="https://github.com/user-attachments/assets/85bfdff4-eaa7-48f8-9f5c-00f4ec38a611" />
</p>

Projeto: SPARK
<br>Sua energia. Seu controle. é SPARK.</br>

Identificação dos Envolvidos
| Papel | Nome(s) |
| :--- | :--- |
| **Product Owner** | João Paulo Oliveira |
| **Scrum Master** | João Paulo Oliveira |
| **Stakeholders** | Wesley Pecoraro, Fabiana Comandini, Paulo Netto, Luciano Trevisan, Júlio Melli, Márcio Marinho |
| **Desenvolvedores Front-End** | Bleddilyn Ferreira, Fernando Filho, Felipe Caetano, João Zeferino |
| **Desenvolvedores Back-End** | Bleddilyn Ferreira, João Oliveira |
| **Full Stack** | Bleddilyn Ferreira, João Oliveira |
| **Designer** | Bleddilyn Ferreira |
| **DBA** | João Oliveira |

<h1> Contexto </h1>

A evolução da eletricidade acompanhou o desenvolvimento tecnológico da humanidade, passando de experimentos fundamentais realizados por cientistas como Franklin, Faraday, Tesla e Edison até chegar à era moderna, na qual a energia elétrica se tornou elemento central para a produção industrial, consumo doméstico e avanço digital.

Com a expansão industrial, cresceu também a preocupação com:

<ul>
  <li>o alto consumo energético,</li>
  <li>os custos provenientes do desperdício,</li>
  <li>os impactos ambientais da geração não renovável.</li>
</ul>

A transição para fontes sustentáveis e o avanço da Indústria 4.0 permitiram a adoção de sistemas inteligentes, capazes de:

<ul>
  <li>monitorar o consumo em tempo real,</li>
  <li>detectar falhas ou irregularidades,</li>
  <li>otimizar o uso de energia para reduzir custos e impactos ao meio ambiente.</li>
</ul>

Sensores, IoT e análise de dados passaram a ser ferramentas essenciais para empresas e setores que buscam eficiência operacional e gestão energética racional.

Nesse contexto surge o ${\color{#B8DBD9}\text{SPARK}}$, um sistema embarcado desenvolvido com ESP32 e sensores de corrente e tensão, para permitir:

<ul>
  <li>monitoramento contínuo do consumo,</li>
  <li>acompanhamento visual por gráficos e indicadores,</li>
  <li>geração de insights que auxiliam na tomada de decisões.</li>
</ul>

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

<ul>
  <li>Microcontrolador ESP32</li>
  <li>Sensor de corrente SCT-013-00</li>
  <li>Sensor de tensão ACS712</li>
</ul>

Esses componentes capturam os valores de consumo energético em tempo real e enviam os dados para o aplicativo, que processa e apresenta os resultados visualmente.

<h3>Tela Principal</h3>

<ul>
  <li>O usuário insere o nome do equipamento monitorado.</li>
  <li>O sistema identifica e coleta os dados via sensores.</li>
  <li>Os resultados são apresentados em forma de:
    <ul>
        <li>informações capturadas,</li>
        <li>tabela de valores,</li>
        <li>gráfico de variação de corrente.</li>
    </ul>
  </li>
</ul>

<h3>Ambiente do Aplicativo</h3>

<ul>
  <li>Tela de cadastro e login obrigatório.</li>
  <li>Configuração e personalização de parâmetros.</li>
  <li>Manual do usuário para facilitar o uso.</li>
  <li>Interface organizada e simples para leitura dos resultados.</li>
</ul>

<h1>Análise de Riscos</h1>
<h3>Precisão e Calibração dos Sensores</h3>

<strong>Risco:</strong> leituras podem apresentar erros se os sensores não estiverem calibrados corretamente.
<br><strong>Mitigação:</strong> procedimentos de validação, calibração inicial e monitoramento periódico.</br>

<h3>Problemas Técnicos de Hardware</h3>

<strong>Risco:</strong> falhas no ESP32, nos sensores ou na alimentação podem interromper o funcionamento.
<br><strong>Mitigação:</strong> manutenção preventiva, testes de carga e redundância de peças essenciais.</br>

<h3>Perda de Conexão</h3>

<strong>Risco:</strong> ausência temporária de Wi-Fi interfere na transmissão dos dados.
<br><strong>Mitigação:</strong> criação de armazenamento offline temporário até o retorno da conexão.</br>

<h3>Aceitação pelo Usuário</h3>

<strong>Risco:</strong> usuários podem ter dificuldade de interpretar informações ou gráficos.
<br><strong>Mitigação:</strong> interface simplificada e manual explicativo.</br>

<h3>Atualizações e Manutenção</h3>

<strong>Risco:</strong> falta de atualização compromete a segurança e desempenho do sistema.
<br><strong>Mitigação:</strong> calendário de manutenção contínua e revisão da base de código.</br>
