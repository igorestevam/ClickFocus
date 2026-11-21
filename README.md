# ClickFocus — (portfólio e captação por WhatsApp)

Site estático HTML/CSS/JS, sem backend e independente do SITE123.

## Transparência comercial

- Os três projetos são demonstrativos. Serena Estética, Black Crown e VOLT **não são clientes reais** e não há métricas ou resultados comerciais comprovados.
- A paleta da Serena foi corrigida conforme `src/styles.css` do repositório `igorestevam/serena-glow-appointments`: marfim, areia, verde-sálvia e dourado. A prévia é uma ilustração, não uma captura de tela.
- O site não promete aumento de vendas, número de leads, velocidade medida, prazo fixo, revisões ilimitadas ou valores não aprovados.
- Custos de domínio, hospedagem, imagens ou serviços externos não estão automaticamente incluídos no orçamento.

## Como chegam os orçamentos

1. O visitante preenche o briefing na seção de contato.
2. **Antes da ativação do WhatsApp Business:** o site oferece apenas a ação "Copiar meu briefing"; não existe envio ou recebimento automático. Não publique o site como canal comercial ativo enquanto estiver assim.
3. **Depois da ativação:** substitua `const WHATSAPP_BUSINESS = '';` em `assets/app.js` por seu número em formato internacional (ex.: `5527999999999`, ilustrativo), sem `+`, símbolos ou espaços. O botão passa a ser "Continuar no WhatsApp". O navegador abre `wa.me` com mensagem preenchida. O interessado precisa **confirmar o envio** no WhatsApp.
4. Você responde manualmente, alinha o serviço e envia uma proposta personalizada pelo WhatsApp ou outro canal combinado.

**Não há cobrança, pagamento, automação de resposta nem armazenamento do briefing no servidor deste site.** O WhatsApp é um serviço externo e tem seus próprios termos de privacidade.

## Executar localmente

Abra `index.html` no navegador. Alternativamente, `python -m http.server 8000` na pasta do projeto. Sem compilação.

## Sites do portfólio

- https://serena-glow-appointments.vercel.app/
- https://black-crown-ten.vercel.app/
- https://volt-training-club.vercel.app/

## Publicar na Vercel

Crie um repositório GitHub e importe-o na Vercel, escolhendo **Other/No Framework**. Verifique antes de tornar público o contato efetivo, a oferta de serviços, os custos externos e o plano de hospedagem. **A Vercel restringe o plano Hobby a uso pessoal/não comercial.** Uma landing page divulgando serviços pagos exige hospedagem com termos que permitam uso comercial; não assumir que o plano Hobby gratuito é adequado. Referência: https://vercel.com/docs/plans/hobby
