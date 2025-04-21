create table types (
    id serial primary key,
    name varchar(50) unique not null
);

create table trainers (
    id serial primary key,
    name varchar(100) not null,
    second_name varchar(100) not null,
    age int not null check (age between 10 and 120),
    region varchar(100),
    badges int default 0 check (badges >= 0)
);

create table pokemons (
    id serial primary key,
    name varchar(100) not null,
    level int not null check (level between 1 and 100),
    type_id integer not null references type(id) on delete restrict,
    trainer_id integer references trainer(id) on delete set null,
    attack int not null check (attack >= 0),
    defense int not null check (defense >= 0),
    speed int not null check (speed >= 0),
    is_legendary boolean not null default false
);

insert into types (name) values
('Normal'),
('Fuego'),
('Agua'),
('Planta'),
('Eléctrico'),
('Hielo'),
('Lucha'),
('Veneno'),
('Tierra'),
('Volador'),
('Psíquico'),
('Bicho'),
('Roca'),
('Fantasma'),
('Dragón'),
('Siniestro'),
('Acero'),
('Hada');

insert into trainers (name, second_name, age, region, badges) values
('Ash', 'Ketchum', 10, 'Kanto', 8),
('Misty', 'Waterflower', 12, 'Kanto', 1),
('Brock', 'Harrison', 15, 'Kanto', 1),
('Gary', 'Oak', 10, 'Kanto', 10);


insert into pokemons (name, level, type_id, trainer_id, attack, defense, speed, is_legendary) values
('Pikachu', 25, 5, 1, 55, 40, 90, false),
('Charizard', 36, 2, 1, 84, 78, 100, false),
('Bulbasaur', 15, 4, 1, 49, 49, 45, false), 
('Staryu', 18, 3, 2, 45, 55, 85, false),
('Onix', 14, 13, 3, 45, 160, 70, false),
('Blastoise', 36, 3, 4, 83, 100, 78, false),
('Mewtwo', 70, 11, null, 110, 90, 130, true);
