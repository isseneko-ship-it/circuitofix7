// ===========================================================
// CircuitoFix — comportamentos compartilhados
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // Formulário de contato — envia para o Formspree (e-mail)
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.querySelector('#form-feedback');
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Enviando...';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          form.reset();
          if (feedback) {
            feedback.textContent = 'Pedido enviado por e-mail! Retornamos em breve pelo telefone informado.';
            feedback.style.color = 'var(--ok)';
            feedback.classList.add('show');
          }
        } else {
          throw new Error('Falha no envio');
        }
      } catch (err) {
        if (feedback) {
          feedback.textContent = 'Não foi possível enviar por e-mail agora. Tente pelo botão do WhatsApp acima.';
          feedback.style.color = 'var(--warn)';
          feedback.classList.add('show');
        }
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
});
