class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // this function for Advanced Filltering for getAllToures Request
  transformQuery(query) {
    // API REQUEST             { 'duration[gte]': '5', difficulty: 'easy' }
    // WHAT API SHOULD BE LIKE { duration: { $gte: '5' }, difficulty: 'easy' }
    const newQuery = {};
    Object.entries(query).forEach(([key, value]) => {
      const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const [, field, op] = match;
        newQuery[field] = { ...(newQuery[field] || {}), [`$${op}`]: value };
      } else {
        newQuery[key] = value;
      }
    });
    return newQuery;
  }

  filter() {
    // Bulid Query
    const queryObj = { ...this.queryString }; // make hard copy to dont change the original object
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // Advanced Filltering
    // gte , gt , lte , lt
    const transformedQuery = this.transformQuery(queryObj);
    this.query = this.query.find(transformedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(",").join(" "); //price maxGroupSize
      this.query = this.query.sort(sortedBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // every thing exclude __v
    }
    return this;
  }

  paginate() {
    // if(limit 10,skip 10:i want page(2):11 - 20) Algorithm => skip ((page - 1) * limit)
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 10;
    this.query = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}

export default APIFeatures;
