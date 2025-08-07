import { ref, computed } from 'vue'

// Liste de fallback en cas d'échec de l'API
const FALLBACK_BLACKLISTED_KEYWORDS = [
  'google',
  'firefox',
  'indeed',
  'linkedin',
  'facebook',
  'twitter',
  'instagram',
  'youtube',
  'amazon',
  'microsoft',
  'apple',
  'netflix',
  'spotify',
  'uber',
  'airbnb',
  'booking',
  'tripadvisor',
  'yelp',
  'stackoverflow',
  'github',
  'reddit',
  'discord',
  'slack',
  'zoom',
  'teams',
  'whatsapp',
  'telegram',
  'tiktok',
  'snapchat',
  'pinterest',
  'ebay',
  'paypal',
  'stripe',
  'shopify',
  'wordpress',
  'wix',
  'squarespace',
  'medium',
  'substack',
  'notion',
  'figma',
  'canva',
  'dropbox',
  'drive',
  'onedrive',
  'icloud',
  'gmail',
  'outlook',
  'yahoo',
  'hotmail',
  'protonmail',
  'tutanota',
  'signal',
  'wechat',
  'line',
  'kakao',
  'naver',
  'baidu',
  'alibaba',
  'tencent',
  'qq',
  'weibo',
  'douyin',
  'xiaohongshu',
  'meituan',
  'didi',
  'bytedance',
  'bilibili',
  'netease',
  'jd',
  'pinduoduo',
  'vipkid',
  'duolingo',
  'coursera',
  'udemy',
  'skillshare',
  'masterclass',
  'khanacademy',
  'edx',
  'codecademy',
  'freecodecamp',
  'w3schools',
  'mdn',
  'gitlab',
  'bitbucket',
  'heroku',
  'vercel',
  'netlify',
  'aws',
  'azure',
  'gcp',
  'digitalocean',
  'linode',
  'vultr',
  'cloudflare',
  'godaddy',
  'namecheap',
  'hostgator',
  'bluehost',
  'dreamhost',
  'siteground',
  'a2hosting',
  'inmotion',
  'hostinger',
  'ionos',
  'ovh',
  'ovhcloud',
  'scaleway',
  'online',
  'kimsufi',
  'soyoustart',
  'runabove',
  'publiccloud',
  'privatecloud',
  'hybridcloud',
  'baremetal',
  'vps',
  'dedicated',
  'shared',
  'reseller',
  'cloud',
  'hosting',
  'domain',
  'ssl',
  'cdn',
  'dns',
  'email',
  'webmail',
  'cpanel',
  'plesk',
  'whm',
  'directadmin',
  'webmin',
  'virtualmin',
  'ispconfig',
  'vestacp',
  'froxlor',
  'ajenti',
  'cockpit',
  'portainer',
  'rancher',
  'kubernetes',
  'docker',
  'swarm',
  'compose',
  'dockerfile',
  'dockerhub',
  'registry',
  'harbor',
  'nexus',
  'artifactory',
  'sonarqube',
  'jenkins',
  'gitlabci',
  'githubactions',
  'circleci',
  'travisci',
  'teamcity',
  'bamboo',
  'azuredevops',
  'bitbucketpipelines',
  'codeship',
  'semaphore',
  'drone',
  'concourse',
  'spinnaker',
  'argo',
  'tekton',
  'knative',
  'istio',
  'linkerd',
  'consul',
  'etcd',
  'zookeeper',
  'redis',
  'memcached',
  'elasticsearch',
  'logstash',
  'kibana',
  'beats',
  'filebeat',
  'metricbeat',
  'packetbeat',
  'heartbeat',
  'auditbeat',
  'functionbeat',
  'journalbeat',
  'winlogbeat',
  'mongodb',
  'mysql',
  'postgresql',
  'mariadb',
  'sqlite',
  'oracle',
  'sqlserver',
  'db2',
  'cassandra',
  'couchdb',
  'couchbase',
  'neo4j',
  'arangodb',
  'orientdb',
  'influxdb',
  'timescaledb',
  'clickhouse',
  'snowflake',
  'bigquery',
  'redshift',
  'dynamodb',
  'cosmosdb',
  'firestore',
  'firebase',
  'supabase',
  'planetscale',
  'neon',
  'railway',
  'render',
  'fly',
  'replit',
  'glitch',
  'codesandbox',
  'stackblitz',
  'gitpod',
  'githubdev',
  'codespaces',
  'cloud9',
  'codenvy',
  'eclipseche',
  'theia',
  'vscode',
  'atom',
  'sublime',
  'vim',
  'emacs',
  'nano',
  'notepad',
  'notepadplusplus',
  'brackets',
  'webstorm',
  'phpstorm',
  'intellij',
  'eclipse',
  'netbeans',
  'xcode',
  'androidstudio',
  'visualstudio',
  'rider',
  'resharper',
  'dotpeek',
  'dotmemory',
  'dotcover',
  'dotnet',
  'aspnet',
  'entityframework',
  'nhibernate',
  'dapper',
  'automapper',
  'mediatr',
  'fluentvalidation',
  'serilog',
  'nlog',
  'log4net',
  'castle',
  'moq',
  'nunit',
  'xunit',
  'mstest',
  'specflow',
  'selenium',
  'playwright',
  'cypress',
  'jest',
  'mocha',
  'chai',
  'sinon',
  'karma',
  'jasmine',
  'protractor',
  'webdriverio',
  'appium',
  'detox',
  'espresso',
  'xctest',
  'junit',
  'testng',
  'cucumber',
  'gherkin',
  'behave',
  'pytest',
  'unittest',
  'nose',
  'tox',
  'coverage',
  'pytestcov',
  'pytestxdist',
  'pytesthtml',
  'pytestallure',
  'robotframework',
  'gauge',
  'karate',
  'restassured',
  'postman',
  'insomnia',
  'soapui',
  'jmeter',
  'gatling',
  'k6',
  'artillery',
  'locust',
  'wrk',
  'ab',
  'siege',
  'vegeta',
  'hey',
  'bombardier',
  'fortio',
  'ghz',
  'grpcurl',
  'grpcui',
  'grpctools',
  'protobuf',
  'thrift',
  'avro',
  'jsonrpc',
  'xmlrpc',
  'soap',
  'graphql',
  'grpc',
  'websocket',
  'socketio',
  'signalr',
  'pusher',
  'pubnub',
  'ably',
  'stream',
  'getstream',
  'sendbird',
  'agora',
  'twilio',
  'vonage',
  'bandwidth',
  'plivo',
  'messagebird',
  'infobip',
  'africastalking',
  'mobitech',
  'mpesa',
  'airtel',
  'mtn',
  'vodafone',
  'orange',
  'telekom',
  'deutsche',
  'o2',
  'three',
  'ee',
  'virgin',
  'giffgaff',
  'lycamobile',
  'lebara',
  'tesco',
  'asda',
  'sainsburys',
  'morrisons',
  'aldi',
  'lidl',
  'iceland',
  'coop',
  'waitrose',
  'marksandspencer',
  'johnlewis',
  'debenhams',
  'houseoffraser',
  'selfridges',
  'harrods',
  'liberty',
  'fortnum',
  'harvey',
  'nichols',
  'fenwick',
  'browns',
  'matchesfashion',
  'netaporter',
  'farfetch',
  'ssense',
  'luisaviaroma',
  'mytheresa',
  'modaoperandi',
  'shopbop',
  'revolve',
  'asos',
  'boohoo',
  'prettylittlething',
  'missguided',
  'instyle',
  'fashionnova',
  'nastygal',
  'freepeople',
  'anthropologie',
  'urbanoutfitters',
  'zara',
  'h&m',
  'hm',
  'uniqlo',
  'gap',
  'oldnavy',
  'bananarepublic',
  'athleta',
  'jcrew',
  'madewell',
  'everlane',
  'reformation',
  'rouje',
  'sezane',
  'sandro',
  'maje',
  'thekooples',
  'ba&sh',
  'comptoir',
  'des',
  'cottons',
  'claudie',
  'pierlot',
  'gerard',
  'darel',
  'musier',
  'paris'
]

/**
 * Composable pour la validation de domaines
 */
export function useDomainValidation() {
  const domainInput = ref('')
  const validationError = ref('')
  const blacklistedKeywords = ref(FALLBACK_BLACKLISTED_KEYWORDS)
  const isLoadingBlacklist = ref(false)
  const blacklistLoaded = ref(false)

  /**
   * Récupère la liste de blacklist depuis le backend
   */
  const loadBlacklistFromBackend = async () => {
    // Si déjà chargé, ne pas recharger
    if (blacklistLoaded.value) {
      return
    }

    isLoadingBlacklist.value = true

    try {
      const response = await fetch('/api/config/blacklist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.blacklistedKeywords) {
          blacklistedKeywords.value = data.blacklistedKeywords
          blacklistLoaded.value = true
          console.log('Blacklist chargée depuis le backend:', blacklistedKeywords.value.length, 'mots-clés')
        } else {
          console.warn('Réponse invalide du backend, utilisation du fallback')
        }
      } else {
        console.warn('Erreur lors du chargement de la blacklist, utilisation du fallback')
      }
    } catch (error) {
      console.error('Erreur réseau lors du chargement de la blacklist:', error)
    } finally {
      isLoadingBlacklist.value = false
    }
  }

  /**
   * Valide un domaine ou une URL contre la blacklist
   * @param {string} domainOrUrl - Le domaine ou l'URL à valider
   * @returns {Object} - Résultat de la validation
   */
  const validateDomain = (domainOrUrl) => {
    if (!domainOrUrl || typeof domainOrUrl !== 'string') {
      return {
        isValid: false,
        blacklistedKeywords: [],
        message: 'Le domaine ou l\'URL est requis'
      }
    }

    // Normaliser l'entrée
    const normalizedInput = domainOrUrl.toLowerCase().trim()
    
    // Supprimer le protocole si présent
    const cleanInput = normalizedInput.replace(/^https?:\/\//, '')
    
    // Supprimer le www si présent
    const domainOnly = cleanInput.replace(/^www\./, '')

    // Vérifier chaque mot-clé blacklisté
    const foundBlacklistedKeywords = []
    
    for (const keyword of blacklistedKeywords.value) {
      if (domainOnly.includes(keyword.toLowerCase())) {
        foundBlacklistedKeywords.push(keyword)
      }
    }

    return {
      isValid: foundBlacklistedKeywords.length === 0,
      blacklistedKeywords: foundBlacklistedKeywords,
      message: foundBlacklistedKeywords.length > 0 
        ? `L'analyse de ${foundBlacklistedKeywords.join(', ')} n'est pas autorisée`
        : null
    }
  }

  /**
   * Valide le domaine en temps réel
   */
  const validateDomainRealtime = computed(() => {
    if (!domainInput.value.trim()) {
      validationError.value = ''
      return { isValid: true }
    }
    
    const validation = validateDomain(domainInput.value)
    validationError.value = validation.message || ''
    return validation
  })

  /**
   * Réinitialise la validation
   */
  const clearValidation = () => {
    validationError.value = ''
    domainInput.value = ''
  }

  // Charger la blacklist au démarrage
  loadBlacklistFromBackend()

  return {
    domainInput,
    validationError,
    validateDomain,
    validateDomainRealtime,
    clearValidation,
    loadBlacklistFromBackend,
    isLoadingBlacklist,
    blacklistLoaded
  }
} 