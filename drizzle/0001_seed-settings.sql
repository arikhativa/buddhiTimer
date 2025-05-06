-- Custom SQL migration file, put your code below! --
INSERT INTO settings_table (id, theme)
SELECT 1, 'system'
WHERE NOT EXISTS (
  SELECT 1 FROM settings_table WHERE id = 1
);
