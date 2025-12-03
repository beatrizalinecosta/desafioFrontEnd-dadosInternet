# Desafio FrontEnd - Dados Internet

Projeto para a vaga FrontEnd, feito com o intuito de mostrar ao usuário uma série de dados sobre o uso da internet. 

[Figma do projeto](https://www.figma.com/design/EGRqhT9BFwnkrmlCGUGJIP/DESAFIO-FRONTEND---NIC.BR?node-id=0-1&t=yfzOhLTzp8tVqntW-1)


## 💻 Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=react,tailwind)](https://skillicons.dev) 

React, Tailwind e biblioteca [HeroUI](https://v3.heroui.com/) para melhora do design.

## Detalhes do Projeto

- Dark mode: Permite que o usuário faça a troca em o dark mode e mode normal de forma fácil. Com o design pensado para que o contraste não atrapalhe a tela do usuário.
- Dados da tabela CSV foram transformados em json para o projeto, estando no repositório localmente.
- A página foi dividida em duas seções: Resumo dos Registros e Tabela Interativa, para melhor visualização dos dados.

Resumo dos Registros:
- Coleção de informações da tabela separadas por gráficos para melhor entendimento. Permite que o usuário abra e feche a seção, para não poluir a tela.
- Permite que o usuário filtre entre os campos Tipo de Tecnologia, Administração e Localização.
- Mostra para o usuário a média de Downloads e Uploads
- Quantidade de Registros por Tecnologia, Localização e Administração (3 gráficos PieChart, contam o total de registros em cada campo)
- Perfomance de Upload por Tecnologia e Localização (2 gráficos de barra que calculam a média de upload)
- Comparativo Download/Upload por Tecnologia (gráfico de barra que compara as médias de download e uploads em cada tipo de tecnologia)

Tabela Interativa:
- Tabela sempre aberta para o usuário, pensando em fácil acesso a todos os dados.
- Usuário pode filtrar Tipos de Tecnologia, Localização e Adminitração. Pode também fazer um filtro personalizado pelo campo de busca.
- Tabela com páginização, mostra até 10 registros por página.
- Botão Exportar CSV. Permite que o usuário exporte os dados filtrados em um arquivo CSV.

## 🚀 Instalando o projeto
Para instalar o projeto, siga estas etapas:

Clone o repositório:

```
git clone https://github.com/beatrizalinecosta/desafioFrontEnd-dadosInternet.git
cd desafioFrontEnd-dadosInternet
```

Instale as dependências:

```
npm install
```

Rodar o projeto:

```
npm run dev
```


