// src/swagger.ts
export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Resource Booking API',
    version: '1.0.0',
    description: 'API para gerenciamento e reserva de recursos universitários',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Autenticação e Login' },
    { name: 'Users', description: 'Gerenciamento de Usuários' },
    { name: 'Resources', description: 'Gerenciamento de Salas e Equipamentos' },
    { name: 'Bookings', description: 'Gerenciamento de Reservas' }
  ],
  paths: {
    // --- AUTH ---
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Realiza login do usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'vinicius@gmail.com' },
                  password: { type: 'string', example: 'Vini123@' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                example: {
                  status: true,
                  status_code: 200,
                  message: "Login bem-sucedido!!",
                  Login: {
                    user: {
                      id_user: 2,
                      name: "Vinicius Guimarães Roberto",
                      email: "vinicius@gmail.com",
                      role: "ADMIN"
                    },
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  }
                }
              }
            }
          },
          401: { description: 'Credenciais inválidas' },
        },
      },
    },

    // --- USERS ---
    '/user': {
      post: {
        tags: ['Users'],
        summary: 'Cria um novo usuário (Registro)',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Miguel Pereira de Oliveira' },
                  email: { type: 'string', example: 'miguel@gmail.com' },
                  password: { type: 'string', example: 'Miguel123@' },
                  role: { type: 'string', enum: ['ADMIN', 'ESTUDANTE'], example: 'ESTUDANTE' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário criado',
            content: {
              'application/json': {
                example: {
                  status: true,
                  status_code: 201,
                  message: "Item criado com sucesso!!",
                  data: {
                    id_user: 3,
                    name: "Miguel Pereira de Oliveira",
                    email: "miguel@gmail.com",
                    role: "ESTUDANTE",
                    created_at: "2025-11-24T02:17:15.000Z"
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Users'],
        summary: 'Lista todos os usuários',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuários retornada',
            content: {
              'application/json': {
                example: [
                  {
                    id_user: 2,
                    name: "Vinicius Guimarães Roberto",
                    email: "vinicius@gmail.com",
                    role: "ADMIN",
                    created_at: "2025-11-24T00:51:53.000Z"
                  },
                  {
                    id_user: 3,
                    name: "Miguel Pereira de Oliveira",
                    email: "miguel@gmail.com",
                    role: "ESTUDANTE",
                    created_at: "2025-11-24T02:17:15.000Z"
                  }
                ]
              }
            }
          }
        }
      }
    },
    '/user/{id}': {
      parameters: [{ in: 'path', name: 'id', schema: { type: 'integer' }, required: true }],
      get: {
        tags: ['Users'],
        summary: 'Busca usuário por ID',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dados do usuário',
            content: {
              'application/json': {
                example: {
                  id_user: 3,
                  name: "Miguel Pereira de Oliveira",
                  email: "miguel@gmail.com",
                  role: "ESTUDANTE",
                  created_at: "2025-11-24T02:17:15.000Z"
                }
              }
            }
          },
          404: { description: 'Usuário não encontrado' }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Atualiza usuário',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Miguel Editado' },
                  email: { type: 'string', example: 'migueledit@gmail.com' },
                  password: { type: 'string' },
                  role: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuário atualizado',
            content: {
              'application/json': {
                example: {
                  status: true,
                  status_code: 200,
                  message: "Item atualizado com sucesso!!",
                  data: {
                    id_user: 3,
                    name: "Miguel Editado",
                    email: "migueledit@gmail.com",
                    role: "ESTUDANTE"
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Deleta usuário',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { 
            description: 'Usuário removido',
            content: {
                'application/json': {
                    example: {
                        status: true,
                        status_code: 200,
                        message: "Item excluído com sucesso!!",
                        data: {
                             id_user: 3,
                             name: "Miguel Pereira de Oliveira",
                             email: "miguel@gmail.com",
                             password: "$2b$10$U3IdHQTVakNcdMcuxDQPF.NE4VngapauiPi09K8W927rJhBFOWbEy",
                             role: "ESTUDANTE",
                             created_at: "2025-11-24T02:17:15.000Z"
                        }
                    }
                }
            }
          }
        }
      }
    },

    // --- RESOURCES ---
    '/resource': {
      post: {
        tags: ['Resources'],
        summary: 'Cria um novo Recurso/Sala (Apenas ADMIN)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Laboratório de Informática 01' },
                  category: { type: 'string', example: 'LABORATÓRIO' },
                  capacity: { type: 'integer', example: 30 },
                  is_active: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          201: { 
            description: 'Recurso criado',
            content: {
                'application/json': {
                    example: {
                        status: true,
                        status_code: 201,
                        message: "Item criado com sucesso!!",
                        data: {
                            id_resource: 3,
                            name: "Laboratório de Informática 01",
                            category: "LABORATÓRIO",
                            capacity: 30,
                            is_active: true,
                            created_at: "2025-11-24T02:45:18.000Z"
                        }
                    }
                }
            }
          },
          403: { description: 'Acesso negado' }
        }
      },
      get: {
        tags: ['Resources'],
        summary: 'Lista todos os recursos disponíveis',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { 
            description: 'Lista de recursos',
            content: {
                'application/json': {
                    example: [
                        {
                            id_resource: 1,
                            name: "Projetor Epson PowerLite",
                            category: "EQUIPAMENTO",
                            capacity: 1,
                            is_active: true,
                            created_at: "2025-11-24T00:52:12.000Z"
                        },
                        {
                            id_resource: 3,
                            name: "Laboratório de Informática 01",
                            category: "LABORATÓRIO",
                            capacity: 30,
                            is_active: true,
                            created_at: "2025-11-24T02:45:18.000Z"
                        }
                    ]
                }
            }
          }
        }
      }
    },
    '/resource/{id}': {
      parameters: [{ in: 'path', name: 'id', schema: { type: 'integer' }, required: true }],
      get: {
        tags: ['Resources'],
        summary: 'Busca recurso por ID',
        security: [{ bearerAuth: [] }],
        responses: { 
            200: { 
                description: 'Dados do recurso',
                content: {
                    'application/json': {
                        example: {
                            id_resource: 1,
                            name: "Projetor Epson PowerLite",
                            category: "EQUIPAMENTO",
                            capacity: 1,
                            is_active: true,
                            created_at: "2025-11-24T00:52:12.000Z"
                        }
                    }
                }
            } 
        }
      },
      put: {
        tags: ['Resources'],
        summary: 'Atualiza recurso (Apenas ADMIN)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Auditório Magno' },
                  category: { type: 'string', example: 'AUDITÓRIO' },
                  capacity: { type: 'integer', example: 150 },
                  is_active: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: { 
            200: { 
                description: 'Atualizado com sucesso',
                content: {
                    'application/json': {
                        example: {
                            status: true,
                            status_code: 200,
                            message: "Item atualizado com sucesso!!",
                            data: {
                                id_resource: 4,
                                name: "Auditório Magno",
                                category: "AUDITÓRIO",
                                capacity: 150,
                                is_active: true,
                                created_at: "2025-11-24T02:47:53.000Z"
                            }
                        }
                    }
                }
            } 
        }
      },
      delete: {
        tags: ['Resources'],
        summary: 'Remove recurso (Apenas ADMIN)',
        security: [{ bearerAuth: [] }],
        responses: { 
            200: { 
                description: 'Removido com sucesso',
                content: {
                    'application/json': {
                        example: {
                            status: true,
                            status_code: 200,
                            message: "Item excluído com sucesso!!",
                            data: {
                                id_resource: 3,
                                name: "Laboratório de Informática 01",
                                category: "LABORATÓRIO",
                                capacity: 30,
                                is_active: true,
                                created_at: "2025-11-24T02:45:18.000Z"
                            }
                        }
                    }
                }
            } 
        }
      }
    },

    // --- BOOKINGS (Atualizado com suas Prints) ---
    '/booking': {
      post: {
        tags: ['Bookings'],
        summary: 'Cria uma nova Reserva',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_user: { type: 'integer', example: 2 },
                  id_resource: { type: 'integer', example: 4 },
                  start_date_time: { type: 'string', format: 'date-time', example: '2025-12-22T17:00:00.000Z' },
                  end_date_time: { type: 'string', format: 'date-time', example: '2025-12-22T18:00:00.000Z' },
                  status: { type: 'string', example: 'CONFIRMADO' }
                }
              }
            }
          }
        },
        responses: {
          201: { 
            description: 'Reserva criada com sucesso',
            content: {
              'application/json': {
                example: {
                  status: true,
                  status_code: 201,
                  message: "Item criado com sucesso!!",
                  data: {
                    id_booking: 6,
                    id_user: 2,
                    id_resource: 4,
                    start_date_time: "2025-12-22T17:00:00.000Z",
                    end_date_time: "2025-12-22T18:00:00.000Z",
                    status: "CONFIRMADO",
                    created_at: "2025-11-24T02:54:42.000Z"
                  }
                }
              }
            }
          },
          409: { description: 'Conflito de horário' }
        }
      },
      get: {
        tags: ['Bookings'],
        summary: 'Lista reservas (Admin vê todas, Estudante vê as suas)',
        security: [{ bearerAuth: [] }],
        responses: { 
          200: { 
            description: 'Lista de reservas',
            content: {
                'application/json': {
                    example: [
                        {
                            id_booking: 1,
                            id_user: 2,
                            id_resource: 1,
                            start_date_time: "2025-12-10T14:00:00.000Z",
                            end_date_time: "2025-12-10T16:00:00.000Z",
                            status: "CANCELADO",
                            created_at: "2025-11-24T01:38:36.000Z"
                        },
                        {
                            id_booking: 6,
                            id_user: 2,
                            id_resource: 4,
                            start_date_time: "2025-12-22T17:00:00.000Z",
                            end_date_time: "2025-12-22T18:00:00.000Z",
                            status: "CONFIRMADO",
                            created_at: "2025-11-24T02:54:42.000Z"
                        }
                    ]
                }
            }
          } 
        }
      }
    },
    '/booking/{id}': {
      parameters: [{ in: 'path', name: 'id', schema: { type: 'integer' }, required: true }],
      get: {
        tags: ['Bookings'],
        summary: 'Busca reserva por ID',
        security: [{ bearerAuth: [] }],
        responses: { 
            200: { 
                description: 'Dados da reserva',
                content: {
                    'application/json': {
                        example: {
                            id_booking: 7,
                            id_user: 2,
                            id_resource: 4,
                            start_date_time: "2026-10-30T14:00:00.000Z",
                            end_date_time: "2026-10-30T16:00:00.000Z",
                            status: "CONFIRMADO",
                            created_at: "2025-11-24T02:57:30.000Z"
                        }
                    }
                }
            } 
        }
      },
      put: {
        tags: ['Bookings'],
        summary: 'Atualiza reserva (Apenas ADMIN)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_user: { type: 'integer' },
                  id_resource: { type: 'integer' },
                  start_date_time: { type: 'string', format: 'date-time' },
                  end_date_time: { type: 'string', format: 'date-time' },
                  status: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 
            200: { 
                description: 'Atualizado com sucesso',
                content: {
                    'application/json': {
                        example: {
                            status: true,
                            status_code: 200,
                            message: "Item atualizado com sucesso!!",
                            data: {
                                id_booking: 7,
                                id_user: 2,
                                id_resource: 4,
                                start_date_time: "2026-10-30T14:00:00.000Z",
                                end_date_time: "2026-10-30T16:00:00.000Z",
                                status: "CONFIRMADO",
                                created_at: "2025-11-24T02:57:30.000Z"
                            }
                        }
                    }
                }
            } 
        }
      },
      delete: {
        tags: ['Bookings'],
        summary: 'Cancela reserva',
        security: [{ bearerAuth: [] }],
        responses: { 
            200: { 
                description: 'Cancelada com sucesso',
                content: {
                    'application/json': {
                        example: {
                            status: true,
                            status_code: 200,
                            message: "Item excluído com sucesso!!",
                            data: {
                                id_booking: 6,
                                id_user: 2,
                                id_resource: 4,
                                start_date_time: "2025-12-22T17:00:00.000Z",
                                end_date_time: "2025-12-22T18:00:00.000Z",
                                status: "CONFIRMADO",
                                created_at: "2025-11-24T02:54:42.000Z"
                            }
                        }
                    }
                }
            } 
        }
      }
    }
  }
};