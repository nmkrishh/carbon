-- users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('org', 'consumer', 'admin')),
    wallet_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- credits table
CREATE TABLE credits (
    id SERIAL PRIMARY KEY,
    org_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    description TEXT,
    doc_url VARCHAR(255),
    token_id INTEGER,
    tx_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'listed', 'retired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- listings table
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    credit_id INTEGER NOT NULL REFERENCES credits(id) ON DELETE CASCADE,
    price NUMERIC NOT NULL,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tx_hash VARCHAR(255),
    amount_paid NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_credits_org_id ON credits(org_id);
CREATE INDEX idx_listings_credit_id ON listings(credit_id);
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_listing_id ON transactions(listing_id);
