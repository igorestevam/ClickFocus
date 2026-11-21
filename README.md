<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/clickfocus-logo-dark.svg">
    <img src="assets/clickfocus-logo.svg" alt="Logotipo ClickFocus" width="540">
  </picture>
  <p><strong>A atenção do seu cliente onde realmente importa.</strong></p>
  <p>Landing pages para apresentar pequenos negócios e facilitar o contato com potenciais clientes.</p>
</div>

# ClickFocus — site oficial e portfólio

A **ClickFocus** é uma iniciativa especializada na criação de landing pages para pequenos negócios. Este repositório reúne o site institucional, a apresentação dos serviços e três projetos demonstrativos.

## Funcionalidades

- Apresentação da marca, serviços e etapas de criação.
- Portfólio com detalhes dos projetos e links para demonstração.
- Perguntas frequentes sobre escopo, prazos, domínios e resultados.
- Formulário de briefing para solicitação de orçamento pelo WhatsApp, após configuração.
- Espaços reservados para WhatsApp Business, e-mail comercial e horário de atendimento.
- Design responsivo, menu mobile e componentes interativos.
- Código independente do SITE123, com HTML, CSS e JavaScript puro.

## Portfólio demonstrativo

| Projeto | Conceito visual | Demonstração |
| --- | --- | --- |
| **Serena Estética** | Marfim, areia, verde-sálvia e dourado discreto | [Ver site](https://serena-glow-appointments.vercel.app/) |
| **Black Crown Barber Studio** | Barbearia premium, preto e dourado | [Ver site](https://black-crown-ten.vercel.app/) |
| **VOLT Training Club** | Academia, preto e vermelho | [Ver site](https://volt-training-club.vercel.app/) |

> **Transparência:** Serena, Black Crown e VOLT são **marcas fictícias** criadas como projetos de portfólio. Não são clientes atendidos, não representam casos de sucesso comercial e não comprovam resultados de marketing. As prévias na ClickFocus são ilustrativas.

## Como funcionam os orçamentos

O site **não calcula preços nem envia propostas automaticamente**. O objetivo do formulário é organizar o briefing e direcionar o visitante ao atendimento.

1. O visitante preenche nome, e-mail, telefone opcional, tipo de projeto e descrição.
2. Com o WhatsApp configurado, o botão **Continuar no WhatsApp** abre a conversa com as informações preenchidas.
3. **O próprio visitante precisa confirmar o envio da mensagem no WhatsApp**.
4. O atendimento analisa a solicitação e envia uma proposta individual, incluindo escopo, prazo, valor, revisões e possíveis custos adicionais.

O site **não recebe pagamentos nem possui backend ou banco de dados para salvar formulários**. Sem o WhatsApp configurado, o botão somente **copia o briefing** — nada é enviado à ClickFocus.

### Configurar WhatsApp Business

No início de `assets/app.js`, preencha a constante `WHATSAPP_BUSINESS` com o novo número, contendo apenas **DDI + DDD + número**, sem `+`, espaços ou traços.

```js
const WHATSAPP_BUSINESS = ''; // exemplo de formato: 5527999999999 (número ilustrativo)
```

Após configurar, teste o redirecionamento, o número de destino e o envio de uma mensagem real. O contato direto também aparecerá na seção **Canais de contato**.

### Configurar o e-mail comercial

No mesmo arquivo:

```js
const CONTACT_EMAIL = ''; // exemplo ilustrativo: contato@seudominio.com
```

Quando um e-mail válido for informado, o endereço aparecerá na seção de contato como link `mailto:`. Até lá, o site mostra **Em preparação**, sem endereço inventado.

### Horários de atendimento

Horário confirmado para atendimento comercial por mensagens:

- **Segunda a sexta:** das **12h às 19h** (horário de Brasília).
- **Sábados, domingos e feriados:** sem horário fixo definido.

Mensagens podem ser enviadas a qualquer momento, mas as respostas são realizadas conforme a disponibilidade durante o horário informado. O mesmo horário deve ser configurado no perfil do WhatsApp Business e, caso a rotina mude, atualizado aqui e na página. Não anunciamos atendimento 24 horas nem respostas imediatas.

## Identidade visual

- **Paleta principal:** preto `#0B0B10`, roxo elétrico `#8B3DFF` e branco.
- **Tipografia:** Space Grotesk e Inter.
- **Marca:** logotipo vetorizado a partir do desenho aprovado de **página/janela + cursor**.

Arquivos em `assets/`:
- `clickfocus-logo.svg` — versão clara com a marca original, exibida neste README;
- `clickfocus-logo-dark.svg` — versão adaptada para o fundo escuro do cabeçalho e do rodapé;
- `favicon.svg` — ícone derivado da mesma marca.

## Rodar localmente

Sem instalação de dependências ou build:

```bash
python -m http.server 8000
```

Abra [http://localhost:8000](http://localhost:8000) ou abra `index.html` diretamente no navegador.

## Organização

```text
├── index.html
├── README.md
└── assets/
    ├── app.js
    ├── site.css
    ├── components.css
    ├── clickfocus-logo.svg
    ├── clickfocus-logo-dark.svg
    └── favicon.svg
```

## Publicação e responsabilidade comercial

O site pode ser hospedado em qualquer provedor compatível com páginas estáticas, **desde que o plano permita uso comercial**. O plano Hobby da Vercel é restrito a uso pessoal/não comercial; consulte [os termos da Vercel](https://vercel.com/docs/plans/hobby) antes de divulgar o serviço. Domínio, hospedagem, licenças, imagens e outros serviços externos devem ser informados separadamente na proposta, quando aplicáveis. A ClickFocus **não promete volume de visitas, leads ou vendas**.

---

**ClickFocus** · Portfólio demonstrativo · © 2026
