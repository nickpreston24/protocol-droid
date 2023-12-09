drop table regex_patterns; -- if not exists regex_patterns
CREATE TABLE regex_patterns
(
    -- id                serial primary key,
    -- name              varchar(40) UNIQUE,
    -- find              varchar(250),
    -- replacement       varchar(250),
    -- languages         varchar(150),
    -- extensions        varchar(150),
    -- target_extensions varchar(150),
    -- target_language   varchar(150),
    -- description       varchar(150),
    -- enabled           boolean default false
);

drop table cars;
CREATE TABLE cars
(
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(255),
    price INT
)

-- https://ammoseek.com/ammo/300aac-blackout/Fiocchi?sort=mfg