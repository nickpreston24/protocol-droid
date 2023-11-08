drop table regex_patterns; -- if not exists regex_patterns
CREATE TABLE regex_patterns
(
    id      integer,
    name    varchar(40) UNIQUE,
    find    varchar(250),
    replace varchar(250),
    enabled boolean
);

drop table cars;
CREATE TABLE cars
(
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(255),
    price INT
)