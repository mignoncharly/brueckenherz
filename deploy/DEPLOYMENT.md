# Ubuntu deployment

This app is isolated as:

- Directory: `/home/mignon/apps/brueckenherz`
- Node runtime: `/home/mignon/apps/brueckenherz/.node`
- Loopback port: `127.0.0.1:3003`
- Service: `brueckenherz.service`
- Nginx site: `brueckenherz-mainz.amtklarpro.de`

## Application preparation

```bash
cd ~/apps/brueckenherz
cp .env.example .env.production.local
chmod 600 .env.production.local
PATH="$PWD/.node/bin:$PATH" npm ci
PATH="$PWD/.node/bin:$PATH" npm run build
```

Configure `RESEND_API_KEY`, `FROM_EMAIL`, and `TO_EMAIL` in `.env.production.local` before expecting forms to deliver mail.

## Root activation

```bash
sudo cp ~/apps/brueckenherz/deploy/brueckenherz.service /etc/systemd/system/brueckenherz.service
sudo cp ~/apps/brueckenherz/deploy/nginx-brueckenherz-mainz.amtklarpro.de.conf /etc/nginx/sites-available/brueckenherz-mainz.amtklarpro.de
sudo ln -sfn /etc/nginx/sites-available/brueckenherz-mainz.amtklarpro.de /etc/nginx/sites-enabled/brueckenherz-mainz.amtklarpro.de
sudo systemctl daemon-reload
sudo systemctl enable --now brueckenherz.service
sudo nginx -t
sudo systemctl reload nginx
```

Verify HTTP before requesting the certificate:

```bash
curl -I http://127.0.0.1:3003/de
curl -I -H 'Host: brueckenherz-mainz.amtklarpro.de' http://127.0.0.1/
```

After DNS resolves to the VPS:

```bash
sudo certbot --nginx -d brueckenherz-mainz.amtklarpro.de
```

## Updating

```bash
cd ~/apps/brueckenherz
git pull --ff-only
PATH="$PWD/.node/bin:$PATH" npm ci
PATH="$PWD/.node/bin:$PATH" npm run build
sudo systemctl restart brueckenherz.service
sudo systemctl --no-pager --full status brueckenherz.service
```
