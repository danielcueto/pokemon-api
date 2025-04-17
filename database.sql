create table type (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) unique not null
);

create table trainer (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    second_name varchar(100) not null,
    age int not null check (age between 10 and 120),
    region varchar(100),
    badges int default 0 check (badges >= 0)
);

create table pokemon (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    level int not null check (level between 1 and 100),
    type_id uuid not null references type(id) on delete restrict,
    trainer_id uuid references trainer(id) on delete set null,
    attack int not null check (attack >= 0),
    defense int not null check (defense >= 0),
    speed int not null check (speed >= 0),
    is_legendary boolean not null default false
);
