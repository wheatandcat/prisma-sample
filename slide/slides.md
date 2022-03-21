---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
layout: intro
colorSchema: 'light'
---

# Prismaを試してみた

<div class="flex justify-center">
  <img
    class="w-50 pt-2"
    src="/prisma-logo.png"
  />
</div>

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub"
    class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---

<div class="flex pb-5">
  <div class="px-5">
    <div class="rounded-full bg-white w-30 h-30 overflow-hidden border-2 border-black border-dotted border-opacity-20">
      <img
        class="w-40 pt-2"
        src="/account.png"
      />
    </div>
  </div>
  <div class="mt-6">
    <h2>自己紹介</h2>
  </div>
</div>
<br />

- 📝 飯野陽平（[wheatandcat](https://github.com/wheatandcat)）
- 🏢 フリーランスエンジニア（シェアフル株式会社CTO）
- 💻 Blog: https://www.wheatandcat.me/
- 📚 Booth: https://wheatandcat.booth.pm/
- 🛠 今までに作ったもの
  - [memoir](https://memoir-lp-mvbeacmwe-wheatandcat.vercel.app/)
  - [ペペロミア](https://peperomia.app/)
  - [Atomic Design Check List](https://atomic-design-checklist.vercel.app/)


<style>
ul {
  padding-left: 1rem;
  margin-top: 0.1rem;
}
li {
  color: #696969;
  @apply font-500;
  font-size:1.25rem;
}
</style>
---

# Prismaとは？

<br/>

- Node.js製のORM
- RDB周りの処理を簡易に扱えるようにする
- Schemaファイルから型情報を自動生成
- 以下のDB対応をサポート
  - PostgreSQL、MySQL、SQL Server、SQLite、MongoDB  

<style>
ul {
  padding-left: 1rem;
  margin-top: 0.1rem;
}
li {
  @apply font-500;
  font-size:1.25rem;
}
</style>
---
clicks: 2
---

# モチベーション

<br/>

[Hasura](https://hasura.io/)や[AWS Amplify](https://aws.amazon.com/jp/amplify/)を使用することで、<br/>工数を掛けずお手軽にRESTful APIやGraphQL APIを作成できるようになった。

<v-clicks at="1">

ただし上記は使用できるプラットフォームが固定されて、<br/>大規模な開発では柔軟性が足りないこともある。

</v-clicks>


<v-clicks at="2">

そこでエンジニアの工数も削減しつつ、<br/>システムの柔軟性を持たせることのできる**Prisma**を試してみる。

<br/>
<br/>

</v-clicks>

[Why Prisma?](https://www.prisma.io/docs/concepts/overview/why-prisma)


<style>
div p {
  line-height: 2rem;
}
a {
  color: #84b9cb;
  @apply font-500;
}
</style>


---

# サンプルを作ってみる

<br/>

以下のチュートリアルをベースに、どんな感じで実装するのか試してみる。

- [Prisma チュートリアル](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres)


<style>
a {
  color: #84b9cb;
  @apply font-500;
}
</style>

---
clicks: 3
---

# CLIツールで初期設定

<br/>
以下のコマンドを実行することで初期設定を行なう。

```bash
$ npx prisma init
```

<div v-click="1">

<div class="mt-6">上記のコマンドで以下のファイルが生成される。</div>

```bash {all|all|3-5|2}
.
├── .env
└── prisma
    └── schema.prisma
```

</div>

<div v-click="2" v-if="$slidev.nav.clicks === 2">
  <div> 
  <br/>
  <br/>
  <div>■ prisma/schema.prisma</div>

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

  </div>
</div>


<div v-click="3">
  <div> 
  <br/>
  <br/>
  <div>■ .env</div>

```prisma
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

  </div>
</div>

<style>
span {
  font-size:0.5rem;
  line-height: 1.2em;
}
</style>

---

# DBのマイグレーション①

<br/>
PrismaではSchemaファイルを修正することでマイグレーションファイルを生成して実行していく。

■ prisma/schema.prisma

```prisma
model Post {
  id        Int      @default(autoincrement()) @id
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model User {
  id      Int      @default(autoincrement()) @id
  email   String   @unique
  name    String?
  posts   Post[]
}
```

<style>
span {
  font-size:0.5rem;
  line-height: 1.2em;
}
</style>

---
clicks: 3
---

# DBのマイグレーション②


<div class="mt-6 mb-3">以下のコマンドを実行する。</div>

```bash
$ npx prisma migrate dev --name init
```

<div v-click="1" class="text-sm">

Schemaファイルを元に以下のSQLファイルを生成する。


</div>

<div v-click="1" v-if="$slidev.nav.clicks === 1" class="text-sm">


<div>■ prisma/migrations/20220321025430_init/migration.sql</div>

```sql
-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
```

</div>

<div v-click="2" v-if="$slidev.nav.clicks === 2" class="text-sm">

<div>■ prisma/migrations/20220321025430_init/migration.sql</div>

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
```

</div>

<div v-click="3" v-if="$slidev.nav.clicks === 3" class="text-sm">

<div>■ prisma/migrations/20220321025430_init/migration.sql</div>

```sql
-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

```

</div>

<style>
span {
  font-size:0.5rem;
  line-height: 1.2em;
}
</style>

---

# Prisma Clientからデータを取得①

<div class="mt-6 mb-3 text-sm">以下のファイルを作成する。</div>

<div class="text-sm">■ index.ts</div>

```ts {all|5-8}
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

<style>
span {
  font-size:0.5rem;
  line-height: 1.2em;
}
</style>

---

# Prisma Clientからデータを取得②

<div class="mt-6 mb-3">以下のコマンドを実行する。</div>

```bash
$ npx ts-node index.ts 
```


<div v-click="1" class="text-sm">

テストデータを挿入して実行すると以下のように値が返ってくる。
```bash
[
  {
    id: 1,
    email: 'test@prisma.io',
    name: 'test',
    posts: [
      {
        id: 1,
        createdAt: 2022-01-01T12:00:00.985Z,
        updatedAt: 2022-01-01T12:00:00.986Z,
        title: 'Hello World',
        content: "foo bar baz",
        published: false,
        authorId: 1
      }
    ],
]
```

</div>

<style>
span {
  font-size:0.5rem;
  line-height: 1rem !important;
}
</style>

---

# Schemaファイルからtypeを自動生成

<br/>
Prisma Clientから生成されたコードはSchemaファイルからtypeも生成してくれるので、VSCodeでコーディングした際に、TypeScriptの補完も効く。

<br/>
<br/>

<div class="flex justify-center">
  <img
    class="w-full pt-2"
    src="/screen01.png"
  />
</div>

<style>
div {
  font-size: 1rem;
  line-height: 1.5rem;
}
</style>

---

# Prisma Clientの書き方①

<br/>

##### 条件に一致するデータを1件抽出

```ts
  const user = await prisma.user.findUnique({
      where: {
        id:1,
      }
  })
```

<br/>

##### 条件に一致するデータ抽出( id >= 20 )

```ts
  const users = await prisma.user.findMany({
    where: {
      AND :{
        id: { gte: 20 }
      }
    }
  })
  console.log(users)
```

[■ 参考1: Prisma チートシート](https://qiita.com/koffee0522/items/92be1826f1a150bfe62e)


<style>
span {
  font-size:0.5rem;
  line-height: 1rem !important;
}
</style>


---

# Prisma Clientの書き方②

<br/>

##### リレーションのSQLの発行を含める/含めない

```ts
  const users = await prisma.user.findMany({
    include: {
      posts: false,
    },
  })
```

<br/>

##### sort & select

```ts
  const users = await prisma.user.findMany({
    select: {
      email: true,
    },
    orderBy: [
      {
        name: 'desc',
      },
    ],
  })
```

[■ 参考: Filtering and sorting](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)


<style>
span {
  font-size:0.5rem;
  line-height: 1rem !important;
}
</style>


---

# Prisma Clientの書き方③

<br/>

##### Transaction & Rollback

```ts
async function transfer(from: string, to: string, amount: number) {
  return await prisma.$transaction(async (prisma) => {
    const sender = await prisma.account.update({
      data: { balance: { decrement: amount } },
      where: { email: from },
    })
    if (sender.balance < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`)
    }
    const recipient = prisma.account.update({
      data: {
        balance: { increment: amount },
      },
      where: { email: to },
    })
    return recipient
  })
}
```


[■ 参考: Prismaでのトランザクションとロールバック](https://zenn.dev/kanasugi/articles/4dbca26e1c4753)


<style>
span {
  font-size:0.5rem;
  line-height: 0.5rem !important;
}
</style>

---
clicks: 2
---

# SQLの発行のログを見たい

```ts
const prisma = new PrismaClient({
    log: ["query"],
})
```

<div v-click="1" v-if="$slidev.nav.clicks === 1" class="text-sm">

以下のコードを実行した場合。
```ts
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
```


</div>

<div v-click="2" v-if="$slidev.nav.clicks === 2" class="text-sm">

以下のようにログが表示される。

```bash
prisma:query BEGIN
prisma:query INSERT INTO "User" ("email","name") VALUES ($1,$2) RETURNING "User"."id"
prisma:query INSERT INTO "Post" ("createdAt","updatedAt","title","published","authorId") VALUES ($1,$2,$3,$4,$5) RETURNING "Post"."id"
prisma:query SELECT "User"."id", "User"."email", "User"."name" FROM "User" WHERE "User"."id" = $1 LIMIT $2 OFFSET $3
prisma:query COMMIT
prisma:query SELECT "User"."id", "User"."email", "User"."name" FROM "User" WHERE 1=1 OFFSET $1
prisma:query SELECT "Post"."id", "Post"."createdAt", "Post"."updatedAt", "Post"."title", "Post"."content", "Post"."published", "Post"."authorId" FROM "Post" WHERE "Post"."authorId" IN ($1) OFFSET $2
```

</div>


<style>
span {
  font-size:0.5rem;
  line-height: 0.5rem !important;
}
</style>


---

# Prisma Studio
<br/>

<div class="mb-3">以下のコマンドを実行するとDBの状態をブラウザからGUIで確認/操作ができる。</div>

```bash
$ npx prisma studio
```

各DBシステムでサポートしているので、お手軽にDBの中身を操作したい際に使用する。

<div class="flex justify-center">
  <img
    class="w-full pt-2"
    src="/screen02.png"
  />
</div>

---

# GraphQLとの親和性①
<br/>

<div>
もともと、Prisma v1はGraphQLを前提としたノーコードで扱える系のフレームでしたが、<br/>
v2のタイミングで方向転換をして、ORMとして切り離しを行い、今の形式になっている。
</div>

[Prisma 2 is Coming Soon](https://www.prisma.io/blog/prisma-2-is-coming-soon-mwwfhevie993)

<br/>

<div v-click="1">

ライブラリ的にはGraphQLと切り離されたが、<br/>
公式的には、GraphQLと一緒に使うことを推奨している節もあるので、基本は合わせて使う方向性が良いされるている。

[How Prisma and GraphQL fit together](https://www.prisma.io/graphql)

</div>

<style>
a {
  color: #84b9cb;
  @apply font-500;
}
</style>
---

# GraphQLとの親和性②

<br/>

実際の親和性の話しに関しては以下の参考記事を参照。
- [GraphQLと相性の良いORM Prisma。](https://qiita.com/joe-re/items/6e09e741ed2e0c6637b0)
- [Apollo ServerとPrismaではじめるGraphQL API開発入門](https://zenn.dev/eringiv3/books/a85174531fd56a)
<style>
a {
  color: #84b9cb;
  @apply font-500;
}
</style>
---


# まとめ

<br/>


**Prisma**もv3になり、プロダクトで使用できるくらいの品質になったのかなと感じた。<br/>

**Prisma** + **GraphQL** + [GraphQL Code Generator](https://www.graphql-code-generator.com/) の組み合わせで、<br/>
Schemaファイルから、すべてのエンティティの型情報を自動生成できるのは魅力的なので、どこかのプロダクトで運用を試してみたい。

個人的にはNode.js自体のコーディングし辛い問題が若干あるので、ここだけ悩み中。（**Deno**で書ければ解決しそうな予感もするので来月調査してみる）


<style>
a {
  color: #84b9cb;
  @apply font-500;
}
p {
  line-height: 1.6em;
}
</style>

---
layout: center
class: "text-center"
---

<div class="text-2xl font-700 text-enter w-full">
  <div>ご清聴ありがとうございました</div>
</div>


<style>
.main {
  display: flex;
  height: 80%;
  width: 100%;
  justify-content: center;
  align-items: center;
  color: #46AE35;
}
</style>


