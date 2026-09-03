# Bem Bonita Beauty

## Acesso temporário durante o lançamento

O site possui uma barreira de acesso aplicada no servidor. Enquanto estiver ativa, visitantes veem apenas a página de lançamento e precisam informar a senha antes que qualquer rota, inclusive `/admin`, seja renderizada.

Configure estas variáveis no ambiente local e também na Vercel:

```env
SITE_ACCESS_PASSWORD=defina-uma-senha-forte
SITE_ACCESS_TOKEN_SECRET=gere-um-segredo-longo-e-aleatorio
```

O segredo pode ser gerado com `openssl rand -hex 32`. As variáveis são usadas somente no servidor e não devem receber o prefixo `VITE_`. Depois de alterar a senha ou o segredo, os acessos já concedidos são invalidados automaticamente.

Sem as duas variáveis, o site permanece fechado e mostra uma mensagem de configuração pendente. Para reabrir o site publicamente no futuro, remova a chamada a `handleSiteAccess` em `src/server.ts`; não coloque a senha em componentes React nem em variáveis `VITE_*`.

Crie um site completo, elegante, moderno e responsivo para o salão “Bem Bonita”, da profissional Francielly Soares, localizado em Ponte Nova – MG.

IDENTIDADE DA MARCA

O site deve seguir a identidade visual do Instagram @salaobembonita_cielly.

A marca é feminina, acolhedora, sofisticada e especializada na beleza de cabelos crespos e cacheados.

Paleta de cores:

- Rosa blush claro: #F6DCE5
- Rosa principal: #E86BB1
- Pink/magenta para destaques: #D91B72
- Preto sofisticado: #171417
- Dourado suave: #C89A55
- Branco quente: #FFF9F7

Use fundos claros e delicados, alternados com algumas seções em preto. Empregue rosa e dourado nos botões, ícones, linhas decorativas e detalhes.

A aparência não deve ser infantil nem excessivamente chamativa. O resultado precisa transmitir cuidado, autoestima, profissionalismo e beleza natural.

TIPOGRAFIA

Use uma combinação elegante:

- Títulos: Playfair Display ou Cormorant Garamond
- Textos, menus e botões: Poppins ou Montserrat

Os títulos devem ser sofisticados e femininos. Os textos precisam ser muito legíveis.

ESTILO VISUAL

- Fotografias grandes e autênticas de mulheres com cabelos crespos e cacheados
- Destaque para cachos definidos, mechas, penteados e transformações
- Elementos com cantos levemente arredondados
- Sombras suaves
- Detalhes orgânicos inspirados no movimento dos cachos
- Pequenos traços dourados ou pink
- Animações discretas ao rolar a página
- Layout sofisticado, espaçado e fácil de navegar
- Não utilizar imagens genéricas de salão com foco apenas em cabelos lisos

ESTRUTURA DO SITE

1. CABEÇALHO

Criar um cabeçalho fixo e elegante contendo:

- Logotipo “Bem Bonita”
- Início
- Sobre
- Serviços
- Resultados
- Produtos
- Depoimentos
- Localização
- Botão destacado “Agendar horário”

No celular, utilizar menu hambúrguer.

2. SEÇÃO PRINCIPAL

Criar uma abertura impactante com uma fotografia de uma mulher negra com cabelos cacheados definidos, em um ambiente elegante com tons de rosa.

Título:
“Seus cachos são a nossa arte”

Subtítulo:
“Cuidado, técnica e beleza para valorizar a identidade dos seus cabelos.”

Adicionar os botões:

- “Agendar pelo WhatsApp”
- “Conhecer os serviços”

Incluir uma pequena informação:
“Especialistas em cabelos crespos e cacheados • Ponte Nova – MG”

3. SOBRE O SALÃO

Título:
“Beleza que respeita a sua essência”

Texto:
“No Bem Bonita, cada cabelo é tratado de forma única. Sob os cuidados de Francielly Soares, o salão oferece técnicas, tratamentos e produtos pensados especialmente para cabelos crespos e cacheados. Mais do que transformar fios, queremos fortalecer a autoestima e revelar a beleza que já existe em cada cliente.”

Adicionar uma fotografia profissional de Francielly no salão e pequenos indicadores, como:

- Atendimento especializado
- Técnicas para cachos e crespos
- Produtos selecionados
- Experiência personalizada

4. SERVIÇOS

Criar cards elegantes com fotografia, descrição curta e botão para solicitar orçamento.

Serviços:

- Tratamentos capilares
- Definição e finalização de cachos
- Mechas e iluminação
- Penteados
- Corte especializado
- Cronograma capilar
- Consultoria para cuidados em casa

Não mostrar preços fixos. Utilizar “Consulte disponibilidade” ou “Solicite uma avaliação”.

5. RESULTADOS

Criar uma galeria visual de antes e depois, com foco em:

- Definição de cachos
- Mechas
- Recuperação capilar
- Penteados
- Transformações

Usar imagens fornecidas pelo salão. Criar filtros por categoria e permitir ampliar as fotografias.

Adicionar a frase:
“Cada transformação começa com escuta, cuidado e técnica.”

6. PRODUTOS

Criar uma seção delicada para apresentar os cosméticos utilizados e recomendados pelo salão.

Título:
“Cuidado profissional também em casa”

Texto:
“Conheça produtos selecionados para manter seus cabelos hidratados, definidos e saudáveis entre uma visita e outra.”

Criar cards para shampoos, máscaras, finalizadores, óleos e kits. Não implementar pagamento online neste primeiro momento. Cada produto deverá ter um botão “Consultar pelo WhatsApp”.

7. DEPOIMENTOS

Criar um carrossel de avaliações com fotografia opcional, nome da cliente, estrelas e depoimento.

Título:
“Quem conhece, recomenda”

Usar depoimentos reais fornecidos pelo salão. Não inventar avaliações.

8. AGENDAMENTO

Criar uma seção em fundo preto com detalhes pink e dourados.

Título:
“Pronta para viver sua transformação?”

Texto:
“Fale com nossa equipe, escolha o serviço desejado e encontre o melhor horário para você.”

Adicionar um formulário curto:

- Nome
- WhatsApp
- Serviço de interesse
- Data preferida
- Mensagem

O envio deve abrir o WhatsApp do salão com uma mensagem já preenchida. Utilizar o número [INSERIR NÚMERO DO WHATSAPP].

Também criar um botão flutuante de WhatsApp em todas as páginas.

9. LOCALIZAÇÃO

Exibir:
“Av. Francisco Vieira Martins, 595, Lanna Shopping, Sala 118, primeiro andar – Ponte Nova, MG.”

Adicionar:

- Mapa incorporado
- Botão “Como chegar”
- Horário de funcionamento: [INSERIR HORÁRIOS]
- Telefone/WhatsApp: [INSERIR NÚMERO]
- Instagram: @salaobembonita_cielly

10. RODAPÉ

Incluir:

- Logotipo Bem Bonita
- Links rápidos
- Endereço
- WhatsApp
- Instagram
- Horários de atendimento
- Política de privacidade
- Direitos autorais

REQUISITOS TÉCNICOS

- Desenvolver em React com TypeScript
- Utilizar Tailwind CSS
- Criar componentes reutilizáveis
- Site totalmente responsivo
- Excelente experiência em celular
- Navegação suave entre as seções
- Otimização de imagens e carregamento rápido
- SEO local para termos como:
  “salão para cabelos cacheados em Ponte Nova”
  “especialista em cachos Ponte Nova”
  “mechas em cabelos cacheados”
  “salão de beleza Ponte Nova MG”
- Adicionar títulos e descrições para compartilhamento em redes sociais
- Garantir contraste, acessibilidade e textos legíveis
- Evitar excesso de animações
- Preparar o projeto para futura integração com sistema de agendamento

Crie inicialmente a página principal completa, já com textos reais em português brasileiro. Onde faltarem informações, utilize marcadores claros entre colchetes, sem inventar dados.

O resultado deve parecer um salão especializado, autoral e sofisticado — não um template genérico de beleza.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d26f904d-fb35-4e30-9256-323f382fe738).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

# Supabase

O projeto está preparado para o Supabase em `https://aolhiogbbzhomvthodkr.supabase.co`.

1. Copie `.env.example` para `.env.local`.
2. No painel do Supabase, abra **Project Settings → API Keys** e copie a chave publicável.
3. Preencha `VITE_SUPABASE_PUBLISHABLE_KEY` em `.env.local`.
4. Execute `supabase/schema.sql` no **SQL Editor** do Supabase.
5. Crie o usuário do painel em **Authentication → Users** e execute o comando comentado no final do SQL para promovê-lo a administrador.

Nunca use a chave `service_role` em variáveis `VITE_*` ou no navegador. O site utiliza apenas a chave publicável, protegida pelas políticas de Row Level Security.
