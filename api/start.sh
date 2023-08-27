echo "Setting up the database..."
npx sequelize-cli db:create
echo "Database created!"
node app.js