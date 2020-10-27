var crypto = require('crypto');

export async function checkAdmin() {
    const response = await fetch("api/admin/logincheck", {
        method: "GET",
        credentials: "include"
    });
    let admin;
    if (response.ok) {
        return admin;
    }
    return false;
}
export function hash_sha512(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return value;
};

export function random_salt() {
    return crypto.randomBytes(Math.ceil(16 / 2))
        .toString('hex')
        .slice(0, 16);
}

export function new_hashsalt(password) {
    const salt = random_salt();
    const hashed = hash_sha512(password, salt);
    return {
        hashed_password: hashed,
        salt: salt
    };
}