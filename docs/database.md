## Database

## 🗄️ MongoDB Database

### Configuration
- **Local database**: `mongodb://localhost:27017/semantixo`
- **Models**: User, AnalysisTextSeo, AnalysisPageSeo, AnalysisInternalLink, AnalysisDomain
- **ODM**: Mongoose

### Data Models

#### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'member' | 'admin' (default: 'member'),
  subscription: 'free' | 'premium',
  analysesCount: Number,
  lastLogin: Date,
  timestamps
}
```

#### AnalysisTextSeo
```javascript
{
  userId: ObjectId,
  text: String,
  seoScore: Number,
  metrics: {
    wordCount: Number,
    characterCount: Number
  },
  timestamps
}
```

#### AnalysisPageSeo
```javascript
{
  userId: ObjectId,
  url: String,
  pageTitle: String,
  metaDescription: String,
  seoScore: Number,
  metrics: {
    wordCount: Number,
    characterCount: Number,
    headingCount: Number,
    imageCount: Number,
    linkCount: Number
  },
  seoElements: Object,
  timestamps
}
```

#### AnalysisInternalLink
```javascript
{
  userId: ObjectId,
  url: String,
  internalLinks: Array,
  linkStructure: Object,
  seoScore: Number,
  metrics: Object,
  timestamps
}
```

#### AnalysisDomain
```javascript
{
  userId: ObjectId,
  domain: String,
  domainAuthority: Number,
  backlinks: Array,
  seoScore: Number,
  metrics: Object,
  timestamps
}
```