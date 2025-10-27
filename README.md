# Interactive Comments Section - Monorepo

Este projeto usa pnpm workspaces para gerenciar um monorepo com aplicações web e server, além de pacotes compartilhados.

## Estrutura do Projeto

```
├── app/                    # Aplicações
│   ├── web/               # Aplicação React (frontend)
│   └── server/            # API Fastify (backend)
├── packages/              # Bibliotecas e configurações compartilhadas
│   ├── typescript-config/ # Configurações TypeScript compartilhadas
│   ├── vitest-config/     # Configurações Vitest compartilhadas
│   └── eslint-config/     # Configurações ESLint compartilhadas
└── package.json           # Configuração do workspace raiz
```

## Pacotes Compartilhados

### @interactive-comments/typescript-config

Configurações TypeScript reutilizáveis:

- `base.json` - Configuração base
- `node.json` - Para aplicações Node.js
- `react.json` - Para aplicações React

### @interactive-comments/vitest-config

Configurações Vitest para testes:

- `base.config.ts` - Configuração base
- `node.config.ts` - Para testes em Node.js

### @interactive-comments/eslint-config

Configurações ESLint:

- `base.js` - Regras básicas
- `node.js` - Para projetos Node.js
- `react.js` - Para projetos React

## Como Usar

### Instalação de Dependências

```bash
pnpm install
```

### Comandos Disponíveis

```bash
# Executar aplicação web
pnpm run start:web

# Executar servidor
pnpm run start:server

# Executar ambos em paralelo
pnpm run dev

# Executar testes do servidor
pnpm run test:server

# Build de todos os projetos
pnpm run build

# Testes de todos os projetos
pnpm run test
```

### Adicionando Dependências

Para adicionar uma dependência a um projeto específico:

```bash
# Para o server
pnpm add --filter server <package-name>

# Para o web
pnpm add --filter web <package-name>

# Para um pacote compartilhado
pnpm add --filter @interactive-comments/typescript-config <package-name>
```

## Vantagens desta Estrutura

1. **Dependências Centralizadas**: TypeScript, Vitest, ESLint são gerenciados centralmente
2. **Configurações Reutilizáveis**: Configurações compartilhadas entre projetos
3. **Facilidade de Manutenção**: Atualizações em um local só
4. **Consistência**: Todos os projetos usam as mesmas configurações
5. **Eficiência**: pnpm reutiliza dependências e economiza espaço em disco

## Configuração nos Projetos

### TypeScript

```json
{
  "extends": "@interactive-comments/typescript-config/node.json"
}
```

### Vitest

```ts
import nodeConfig from "@interactive-comments/vitest-config/node.config";
export default nodeConfig;
```

### ESLint

```js
import nodeConfig from "@interactive-comments/eslint-config/node.js";
export default nodeConfig;
```
