# Admin de links (SyncPulse)

Painel em `https://www.syncpulse.com.br/admin/` para editar a página `links.syncpulse.com.br`
(repositório `kpedro/syncpulse-links`).

- Login: Google (provedor do Supabase) ou link mágico por e-mail (só para contas já existentes).
- Só e-mails em `public.syncpulse_links_admins` conseguem salvar (RLS); os demais veem "Acesso negado".
- Edita perfil (nome, bio, @, foto, cores), seções e links (adicionar, editar, apagar, reordenar, ocultar),
  com prévia ao vivo. Tudo salva automaticamente ao sair do campo.
- `config.js` traz só a URL do Supabase e a chave anon (pública).
- `links-render.js`/`links-render.css` são os mesmos do repositório `syncpulse-links`.

Para adicionar outro administrador (SQL no Supabase):

```sql
insert into public.syncpulse_links_admins (email) values ('email@exemplo.com');
```
