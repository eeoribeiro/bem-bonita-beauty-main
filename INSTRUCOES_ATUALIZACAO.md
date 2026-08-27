# 🚀 Guia de Atualização & Deploy — Salão Bem Bonita

Este documento contém todas as instruções necessárias para o sócio e para a IA assistente colocarem esta nova versão no ar sem nenhum erro.

---

## 📌 1. O Que Foi Adicionado e Melhorado Nesta Versão

1. **Favicon & Logotipo Oficial:**
   * Favicon SVG exclusivo "BB" em tons dourados e rose gold na aba do navegador.
   * Suporte para upload de Logotipo oficial com fallback tipográfico premium.
2. **Espaço Físico do Salão no Lanna Shopping:**
   * Nova seção e galeria de fotos com visualização ampliada (modal tela cheia) do salão no primeiro andar, sala 118.
3. **Equipe Completa (3 Profissionais):**
   * Apresentação destacada de **Francielly Soares** (Dona, Criadora & Cabeleireira Especialista) e das duas profissionais da equipe.
   * Links diretos de WhatsApp personalizados para cada profissional.
4. **Cursos & Mentorias com Francielly Soares:**
   * Chamadas e página exclusiva `/cursos` destacando que todas as formações e workshops são ministrados diretamente pela Francielly.
5. **Painel Administrativo (/admin):**
   * **Modo Demonstração Local Ativo:** Permite testar e demonstrar todas as funcionalidades localmente.
   * **Fotos do Site:** Botão direto *"Trocar foto"* em cada área (Hero, Sobre, Produtos, Francielly e Salão).
   * **Gestão de Serviços & Galeria:** Arraste (*Drag & Drop*) e botões de setas para reordenar a vitrine.
   * **Gestão da Equipe com Novo Modal:** Upload visual de fotos e gerenciador de chips de cargos (adicionar/remover sugestões dinâmicas).
6. **Mobile-First & Responsividade:**
   * 100% otimizado para celulares e tablets (menu lateral drawer, modais com rolagem suave, botões de toque adequados).

---

## 🤖 2. O Que a IA do Sócio Precisa Fazer (Prompt Pronto)

Se o seu sócio estiver usando uma IA (Claude Code, Cursor, Windsurf, ChatGPT, Antigravity, etc.), basta ele enviar este comando para a IA dele:

```markdown
Olá! Acabamos de atualizar o projeto do Salão Bem Bonita com novas funcionalidades (Gestão de Equipe com 3 profissionais, galeria do Espaço Físico no Lanna Shopping, Cursos com a Francielly, favicon oficial e novo painel de fotos).

Por favor, execute os seguintes passos no projeto:
1. Instale as dependências: npm install
2. Teste o build de produção para validar que está 100%: npm run build
3. Inicie o servidor local para conferência: npm run dev
4. (Opcional) Se estivermos usando o Supabase na nuvem, execute o arquivo supabase/schema.sql no SQL Editor do Supabase para atualizar as tabelas professionals, site_settings e o storage bucket.
```

---

## 💻 3. Comandos Para Subir no GitHub e Colocar no Ar

### Passo A — Você (Subir no GitHub):
No terminal da sua pasta do projeto, execute:

```bash
git init
git add .
git commit -m "feat: atualizacao completa com equipe, cursos, fotos do espaco e novo admin"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO_GITHUB
git push -u origin main
```
*(Se o repositório já existir, basta fazer `git add .`, `git commit -m "feat: atualizacao completa"` e `git push`)*.

---

### Passo B — Seu Sócio (Baixar e Rodar):
Na máquina do seu sócio:

```bash
git pull origin main
npm install
npm run build
npm run dev
```

---

### Passo C — Publicar na Vercel (Produção):
Se o projeto já estiver conectado à Vercel, o deploy acontecerá **automaticamente** assim que o `git push` for feito para a branch `main`.

---

## 🗄️ 4. Banco de Dados Supabase (Opcional)
Se vocês utilizam o Supabase em produção:
1. Acessem o painel do **Supabase** do projeto.
2. Vão em **SQL Editor** -> **New Query**.
3. Copiem e colem todo o conteúdo do arquivo `supabase/schema.sql` e cliquem em **Run**.
4. Isso garantirá que as tabelas `professionals`, `site_settings` (novas colunas de logo e biografia) e o storage bucket `site-images` fiquem 100% sincronizados.
