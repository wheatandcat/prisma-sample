# nexus-prisma

## docker 起動

```bash
$ docker-compose up
```

## マイグレーション

```bash
$ yarn prisma migrate dev --name init
```

## 起動

```bash
$ yarn dev
```

## seed

```bash
$ yarn ts-node prisma/seed.ts
```

## studio

```bash
$ yarn prisma studio
```
