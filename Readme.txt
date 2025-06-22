
Projeto Final — Jogo 2D Multiplayer com React, p5.js e Socket.io

Este projeto consiste em um jogo 2D multiplayer desenvolvido como trabalho final para a disciplina de Canvas.
A proposta é permitir que múltiplos jogadores interajam em tempo real dentro de um ambiente compartilhado,
utilizando tecnologias modernas de desenvolvimento web e comunicação em rede.

Sobre o Jogo

O jogo coloca o jogador no controle de um personagem capaz de andar, saltar e interagir com diferentes tipos de obstáculos e plataformas.
O cenário é compartilhado por todos os jogadores conectados, promovendo uma experiência de interação e desafio coletivo.

O objetivo principal é percorrer o mapa superando obstáculos, evitando armadilhas.
É possível jogar com mais de um jogador simultaneamente, desde que estejam na mesma rede local.

Estrutura e Arquitetura do Projeto

O projeto está organizado em dois módulos principais:

- `src/` — Interface do jogo, construída com **React**, **TypeScript** e **p5.js**
- `server/` — Servidor de comunicação em tempo real, desenvolvido com **Node.js**, **Express** e **Socket.io**

src/

- Utiliza React para gerenciamento de telas e estados.
- Integra p5.js para renderização em canvas e manipulação visual.
- Controla fluxo de menus, início de jogo, e comportamento dos jogadores.
- Estabelece conexão com o servidor via Socket.io para sincronização de dados.

server/

- Recebe conexões dos jogadores via Socket.io.
- Gerencia identificações, posições e interações entre jogadores.
- Transmite atualizações em tempo real para todos os conectados.
- Permite múltiplas sessões simultâneas na mesma rede.

Como Executar o Projeto

Pré-requisitos

- Node.js (recomendado: versão 18 ou superior)
- Gerenciador de pacotes `npm`
- Dois terminais (ou abas) para rodar o servidor e o cliente separadamente
- Dois navegadores ou dispositivos conectados à **mesma rede Wi-Fi**

Passo 1 — Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

---

Passo 2 — Instalar Dependências

Frontend (React + p5.js)

```bash
cd client
npm install
```

Backend (Node.js + Socket.io)

```bash
cd ../server
npm install
```

---

Passo 3 — Executar o Servidor

No diretório `/server`, inicie o backend:

```bash
npm start
```

Certifique-se de que o `server.listen(...)` esteja configurado com o endereço `0.0.0.0` para permitir conexões externas na LAN:

```js
server.listen(3000, '0.0.0.0');
```

---

Passo 4 — Executar o Front

No diretório `/src`, execute:

```bash
npm run dev -- --host
```

O Vite fornecerá um endereço como:

```
http://192.168.0.2:5173/
```

Este é o endereço que os demais dispositivos da rede deverão acessar.

---

Instruções para Jogar em Rede Local (LAN)

1. Certifique-se de que todos os dispositivos estejam conectados à **mesma rede**.
2. No navegador de cada dispositivo, acesse o endereço indicado pelo Vite (exemplo: `http://192.168.0.2:5173/`).
3. Cada aba ou dispositivo representará um jogador distinto na mesma sessão.
4. A interação e sincronização entre jogadores ocorrerá automaticamente via Socket.io.

---

Possíveis Problemas e Soluções

- **Conexão recusada ou página não carrega**:
  - Verifique se o servidor foi iniciado corretamente.
  - Confirme se o firewall do sistema permite conexões nas portas **3000** e **5173**.

- **Outro dispositivo não acessa o IP da máquina host**:
  - Confirme se o servidor foi iniciado com `'0.0.0.0'` no `listen()`.
  - Verifique se os dispositivos estão de fato na mesma rede.

- **Jogo recarrega para uma rota inválida (`/1`)**:
  - O projeto não utiliza React Router. Certifique-se de acessar sempre pela raiz (`/`).

---

Autores

Lucas Azzolin Haubmann & Vinicius Lima Teider & Edmund Soares de Sousa
Alunos do 3º período de Sistemas de Informação — PUC-PR  
Trabalho desenvolvido para a disciplina de Canva  

---

Este projeto representa a aplicação prática de conceitos de redes, sincronização em tempo real, desenvolvimento de jogos e programação modular orientada a objetos.
