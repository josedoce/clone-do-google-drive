/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
  clearMocks: true,
  restoreMocks: true,//limpará mocks para não ter problemas.
  //collectCoverage: true, //exibe uma tabela
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: [ //quero um reporte 
    'text',//no formato de texto
    'lcov'//no formato de html
  ],
  testEnvironment: "node",//ambiente de testes será node
  coverageThreshold: {//nivel em % de cobertura para os testes
    global: {
      branchs: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  watchPathIgnorePatterns: [//nao assista tudo que acontecer nessas pastas
    'node_modules',
  ],
  transformIgnorePatterns: [//se algo for alterado nesa pasta, ignore.
    'node_modules',
  ],
  collectCoverageFrom: [ //onde ele vai pegar o coverage
    'src/**/*.js', 
    '!src/**/index.js'//ignore este, pois ele não tem logica
  ]
};