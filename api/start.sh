echo "Setting up the database..."
npx sequelize-cli db:create
echo "Migrating the database..."
npx sequelize-cli db:migrate
echo "Database ready!"
node app.js