const mysql = require('mysql2/promise'); // mysql2 package is compatible with MariaDB

class DatabaseManager {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.MYSQL_HOST || 'mysql', // MariaDB service name
                user: process.env.MYSQL_USER || 'root',
                password: process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD,
                database: process.env.MYSQL_DATABASE || 'symfony'
            });
            
            await this.createTable();
            console.log('Database connection established');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS breezy_smartphones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(255),
                brand VARCHAR(100),
                model VARCHAR(255),
                grade VARCHAR(50),
                storage VARCHAR(50),
                color VARCHAR(100),
                price DECIMAL(10, 2),
                currency VARCHAR(10),
                url VARCHAR(500),
                image_url VARCHAR(500),
                availability VARCHAR(50),
                product_code VARCHAR(100),
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_product (brand, model, grade, storage, color, product_code),
                INDEX idx_product_code (product_code),
                INDEX idx_brand_model (brand, model)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await this.connection.execute(createTableQuery);
        console.log('Database table ready');
    }

    async saveProducts(products) {
        if (!products.length) {
            console.log('No products to save');
            return;
        }

        const insertQuery = `
            INSERT INTO breezy_smartphones (
                category, brand, model, grade, storage, color,
                price, currency, url, image_url, availability, product_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                price = VALUES(price),
                availability = VALUES(availability),
                updated_at = CURRENT_TIMESTAMP
        `;

        let savedCount = 0;
        for (const product of products) {
            try {
                await this.connection.execute(insertQuery, [
                    product.category,
                    product.brand,
                    product.model,
                    product.grade,
                    product.storage,
                    product.color,
                    product.price,
                    product.currency,
                    product.url,
                    product.image_url,
                    product.availability,
                    product.product_code
                ]);
                savedCount++;
            } catch (error) {
                console.error('Error saving product:', error);
            }
        }

        console.log(`Saved ${savedCount} products to database`);
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
        }
    }
}

module.exports = DatabaseManager;
