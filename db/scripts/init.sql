CREATE TABLE users (
  id serial PRIMARY KEY,
  data jsonb
);

INSERT INTO users (data) VALUES
('{"name": "Felix", "password": "Felix70net"}');