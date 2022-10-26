module.exports = mongoPool => {
    return {
        getVerses(query) {
            return mongoPool.collection(process.env.MONGODB_COLLECTION)
                .find(query)
                .toArray()
                .then(rows => {
                        return rows.sort((a, b) =>
                            a.verse - b.verse
                        ).map((row) => ({
                            id: row._id,
                            book: row.bookName,
                            chapter: row.chapter,
                            verse: row.verse,
                            text: row.text
                        }))
                    }
                );
        },
        getText(query) {
            return mongoPool.collection(process.env.MONGODB_COLLECTION)
                .find(query)
                .toArray()
                .then(rows => rows.sort((a, b) =>
                    a.verse - b.verse
                ).map(row => row.text).join(' '));
        },
    }
};
