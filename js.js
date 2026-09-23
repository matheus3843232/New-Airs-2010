document.addEventListener("DOMContentLoaded", function () {
  // =========================================================
  // ELEMENTOS PRINCIPAIS
  // =========================================================

  const formularioBusca = document.querySelector(".search-box");
  const campoBusca = document.getElementById("campoDestino");
  const caixaSugestoes = document.getElementById("sugestoesDestinos");

  const cidades = Array.from(
    document.querySelectorAll("#listaCidades .cidade")
  );

  const mensagemSite = document.querySelector(".mensagem-site");

  const botaoVerMais = document.getElementById("botaoVerMais");
  const cidadesExtras = document.querySelectorAll(".cidade-extra");

  // =========================================================
  // MODAL DE OFERTAS
  // =========================================================

  const modalOfertas = document.getElementById("modalOfertas");
  const fecharOfertas = document.getElementById("fecharOfertas");
  const ofertaTitulo = document.getElementById("ofertaTitulo");
  const ofertaImagem = document.getElementById("ofertaImagem");
  const ofertaDestaques = document.getElementById("ofertaDestaques");
  const ofertaConteudo = document.getElementById("ofertaConteudo");

  // =========================================================
  // BENEFÍCIOS
  // =========================================================

  const painelBeneficio = document.getElementById("painelBeneficio");
  const beneficioTitulo = document.getElementById("beneficioTitulo");
  const beneficioTexto = document.getElementById("beneficioTexto");
  const beneficioAcao = document.getElementById("beneficioAcao");

  const botoesBeneficio = document.querySelectorAll(".beneficio-btn");

  // =========================================================
  // AVALIAÇÕES
  // =========================================================

  const formAvaliacao = document.getElementById("formAvaliacao");

  const estrelasAvaliacao = Array.from(
    document.querySelectorAll(".estrela-avaliacao")
  );

  const nomeAvaliacao = document.getElementById("nomeAvaliacao");
  const textoAvaliacao = document.getElementById("textoAvaliacao");

  const contadorAvaliacao =
    document.getElementById("contadorAvaliacao");

  const statusAvaliacao =
    document.getElementById("statusAvaliacao");

  const listaDepoimentos =
    document.getElementById("listaDepoimentos");

  const botaoMaisAvaliacoes =
    document.getElementById("botaoMaisAvaliacoes");

  let notaSelecionada = 0;

  let avaliacoesExpandidas = false;

  const limiteAvaliacoesVisiveis = 2;

  // =========================================================
  // FUNÇÕES GERAIS
  // =========================================================

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function mostrarMensagem(texto) {
    if (!mensagemSite) return;

    mensagemSite.textContent = texto;

    mensagemSite.classList.add("mostrar");

    clearTimeout(window.timerMensagemCidade);

    window.timerMensagemCidade =
      setTimeout(function () {
        mensagemSite.classList.remove("mostrar");
      }, 2500);
  }

  // =========================================================
  // VEJA MAIS DESTINOS
  // =========================================================

  function abrirCidadesExtras() {
    if (!botaoVerMais) return;

    cidadesExtras.forEach(function (cidade) {
      cidade.classList.add("cidade-extra-visivel");
    });

    botaoVerMais.setAttribute(
      "aria-expanded",
      "true"
    );

    botaoVerMais.textContent =
      "Ver menos destinos";
  }

  function fecharCidadesExtras() {
    if (!botaoVerMais) return;

    cidadesExtras.forEach(function (cidade) {
      cidade.classList.remove(
        "cidade-extra-visivel"
      );
    });

    botaoVerMais.setAttribute(
      "aria-expanded",
      "false"
    );

    botaoVerMais.textContent =
      "Veja mais destinos";
  }

  if (botaoVerMais && cidadesExtras.length) {
    botaoVerMais.addEventListener(
      "click",
      function () {
        const aberto =
          botaoVerMais.getAttribute(
            "aria-expanded"
          ) === "true";

        if (aberto) {
          fecharCidadesExtras();
        } else {
          abrirCidadesExtras();
        }
      }
    );
  }

  // =========================================================
  // PESQUISA
  // =========================================================

  function nomesDasCidades() {
    return cidades
      .map(function (cidade) {
        const titulo =
          cidade.querySelector(
            ":scope > h3"
          );

        return titulo
          ? titulo.textContent.trim()
          : "";
      })
      .filter(Boolean);
  }

  function esconderSugestoes() {
    if (
      !caixaSugestoes ||
      !campoBusca
    ) {
      return;
    }

    caixaSugestoes.hidden = true;

    campoBusca.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  function renderizarSugestoes(filtro) {
    if (
      !caixaSugestoes ||
      !campoBusca
    ) {
      return;
    }

    const termo =
      normalizar(filtro);

    const nomes =
      nomesDasCidades().filter(
        function (nome) {
          return normalizar(nome)
            .includes(termo);
        }
      );

    caixaSugestoes.innerHTML = "";

    if (!nomes.length) {
      const vazio =
        document.createElement("div");

      vazio.className =
        "sugestao-vazia";

      vazio.textContent =
        "Nenhuma cidade encontrada";

      caixaSugestoes.appendChild(vazio);
    } else {
      nomes.forEach(function (nome) {
        const item =
          document.createElement("button");

        item.type = "button";

        item.className =
          "sugestao-destino";

        item.setAttribute(
          "role",
          "option"
        );

        item.textContent = nome;

        item.addEventListener(
          "click",
          function () {
            campoBusca.value = nome;

            esconderSugestoes();

            pesquisarCidade(nome);
          }
        );

        caixaSugestoes.appendChild(item);
      });
    }

    caixaSugestoes.hidden = false;

    campoBusca.setAttribute(
      "aria-expanded",
      "true"
    );
  }

  function pesquisarCidade(valor) {
    const pesquisa =
      normalizar(valor);

    cidades.forEach(
      function (cidade) {
        cidade.classList.remove(
          "destinoSelecionado"
        );
      }
    );

    if (!pesquisa) {
      mostrarMensagem(
        "Digite ou escolha uma cidade."
      );

      return;
    }

    let encontrada =
      cidades.find(function (cidade) {
        const titulo =
          cidade.querySelector(
            ":scope > h3"
          );

        return (
          titulo &&
          normalizar(
            titulo.textContent
          ) === pesquisa
        );
      });

    if (!encontrada) {
      encontrada =
        cidades.find(
          function (cidade) {
            const titulo =
              cidade.querySelector(
                ":scope > h3"
              );

            return (
              titulo &&
              normalizar(
                titulo.textContent
              ).includes(pesquisa)
            );
          }
        );
    }

    if (!encontrada) {
      mostrarMensagem(
        "Cidade não encontrada entre os destinos disponíveis."
      );

      return;
    }

    // Se estiver escondida no Veja Mais,
    // abre automaticamente.

    if (
      encontrada.classList.contains(
        "cidade-extra"
      )
    ) {
      abrirCidadesExtras();
    }

    encontrada.classList.add(
      "destinoSelecionado"
    );

    const nome =
      encontrada
        .querySelector(":scope > h3")
        .textContent
        .trim();

    mostrarMensagem(
      "Destino encontrado: " + nome
    );

    encontrada.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  if (campoBusca) {
    campoBusca.addEventListener(
      "focus",
      function () {
        renderizarSugestoes(
          campoBusca.value
        );
      }
    );

    campoBusca.addEventListener(
      "click",
      function () {
        renderizarSugestoes(
          campoBusca.value
        );
      }
    );

    campoBusca.addEventListener(
      "input",
      function () {
        renderizarSugestoes(
          campoBusca.value
        );
      }
    );
  }

  if (formularioBusca) {
    formularioBusca.addEventListener(
      "submit",
      function (evento) {
        evento.preventDefault();

        esconderSugestoes();

        pesquisarCidade(
          campoBusca
            ? campoBusca.value
            : ""
        );
      }
    );
  }

  document.addEventListener(
    "click",
    function (evento) {
      if (
        formularioBusca &&
        !formularioBusca.contains(
          evento.target
        )
      ) {
        esconderSugestoes();
      }
    }
  );

  // =========================================================
  // DADOS DOS DESTINOS
  // =========================================================

  const dadosDestinos = {
    fortaleza: {
      nome: "Fortaleza",

      secoes: [
        [
          "Voos",
          "Mais barato: R$ 1.888,01 partindo de São Paulo e pousando em Pinto Martins (no Pix). Melhor opção: R$ 3.538,54 partindo de São Paulo e pousando em Pinto Martins."
        ],

        [
          "Estadia",
          "Praiano Hotel: R$ 379,00 a noite, com café da manhã incluído e localização na beira do mar."
        ],

        [
          "Alimentação",
          "Carne de sol, baião de dois, moqueca, rapadura e tapioca."
        ],

        [
          "Pontos turísticos",
          "Ponte dos Ingleses e Espigão de Iracema; Centro Dragão do Mar de Arte e Cultura; Mercado Central de Fortaleza; Catedral Metropolitana de Fortaleza."
        ],

        [
          "Cultura",
          "Combinação de tradições indígenas, africanas e europeias, refletida em festas, música, dança, gastronomia, artesanato e patrimônio histórico."
        ]
      ],

      links: [
      
        [
          "Ver Praiano Hotel na Agoda",
          "https://www.agoda.com/pt-br/praiano-hotel/hotel/all/fortaleza-br.html"
        ],

        [
          "Ver pontos turísticos",
          "https://www.dicasdeviagem.com/pontos-turisticos-de-fortaleza/"
        ]
      ]
    },

    "canoa quebrada": {
      nome: "Canoa Quebrada",

      secoes: [
        [
          "Transporte",
          "De São Paulo para Canoa Quebrada: R$ 884 a R$ 2.823 (avião e ônibus). De Fortaleza para Canoa Quebrada: R$ 80 a R$ 150."
        ],

        [
          "Estadia",
          "Hotel Pousada Solarium, nota 9,3. Para 7 dias, o preço informado é R$ 1.600."
        ],

        [
          "Alimentação",
          "Gastronomia baseada em frutos do mar, com destaque para moquecas, camarões e peixes frescos."
        ],

        [
          "Pontos turísticos",
          "Praia de Canoa Quebrada, Broadway de Canoa Quebrada e falésias vermelhas de Canoa Quebrada."
        ],

        [
          "Cultura",
          "Fusão entre a tradição nativa cearense, a influência hippie dos anos 60/70 e o turismo vibrante."
        ]
      ],

      links: [
        [
          "Pesquisar hospedagem no Booking",
          "https://www.booking.com/searchresults.pt-br.html?ss=Canoa+Quebrada"
        ]
      ]
    },

    maceio: {
      nome: "Maceió",

      secoes: [
        [
          "Estadia",
          "Preço por 5 dias: R$ 800 a R$ 1.500 em apartamento perto da praia."
        ],

        [
          "Restaurante",
          "Faixa informada: R$ 60 a R$ 200."
        ],

        [
          "Preço para ir",
          "Entre R$ 2.000 e R$ 3.900."
        ],

        [
          "Pontos turísticos",
          "Museu Palácio Floriano Peixoto (MUPA); Centro Histórico de Maceió; Praia de Ponta Verde; Praia de Jatiúca."
        ],

        [
          "Local",
          "Maceió é a capital do estado de Alagoas, na região Nordeste do Brasil."
        ],

        [
          "Cultura",
          "Ligada às tradições nordestinas, com influências indígenas, africanas e portuguesas. Manifesta-se na música, dança, culinária, festas e no modo de vida local."
        ]
      ],

      links: [
        [
          "Pesquisar hospedagem no Airbnb",
          "https://www.airbnb.com.br/s/Macei%C3%B3/homes"
        ]
      ]
    },

    "croa da baleia": {
      nome: "Crôa da Baleia",

      secoes: [
        [
          "Voos e acesso",
          "R$ 3.107 partindo de São Paulo para Belém. O acesso é feito por jangadas ou lanchas a partir da praia durante a maré baixa, com custo de cerca de R$ 20 por pessoa."
        ],

        [
          "Estadia",
          "R$ 1.714 por 7 dias, casa única."
        ],

        [
          "Alimentação",
          "Vitória-Régia: prato com influências africanas e indígenas, preparado com quiabo, azeite de dendê e camarões. Samaúma: bebida fermentada à base de mandioca. Chá de ervas amazônicas."
        ],

        [
          "Pontos turísticos",
          "Crôa da Baleia; Taipu de Fora; Ponta do Mutá; Ilha da Pedra Furada; Lagoa Azul."
        ],

        [
          "Cultura",
          "A Crôa da Baleia (ou Coroa da Baleia) é descrita como um banco de areia ou ilha próxima à costa, acessível de jangada."
        ]
      ],

      links: [
        [
          "Pesquisar passagem",
          "https://www.vaidepromo.com.br/"
        ],

        [
          "Pesquisar hospedagem",
          "https://www.booking.com/"
        ]
      ]
    },

    teresina: {
      nome: "Teresina",

      secoes: [
        [
          "Transporte",
          "De São Paulo até Teresina: R$ 1.258,54 por pessoa (avião)."
        ],

        [
          "Estadia",
          "Rede Andrade Luxor Hotel: 7 noites para 2 pessoas por R$ 1.553."
        ],

        [
          "Alimentação",
          "Bolo frito, beiju e panelada."
        ],

        [
          "Pontos turísticos",
          "Shopping Rio Poty, Ponte Estaiada e Poty Cabana Park."
        ],

        [
          "Cultura",
          "A formação cultural da população teresinense é marcada pela diversidade brasileira e nordestina."
        ],

        [
          "Custo de vida",
          "R$ 2.690 por mês."
        ]
      ],

      links: []
    },

    "sao raimundo nonato": {
      nome: "São Raimundo Nonato",

      secoes: [
        [
          "Local",
          "Localizado no Piauí, cerca de 576 km da capital Teresina."
        ],

        [
          "Transporte",
          "Foi encontrado valor de ida entre R$ 500 e R$ 600."
        ],

        [
          "Hotel",
          "Hotel e Restaurante Santa Isabel: R$ 219 a R$ 240 a diária."
        ],

        [
          "Pontos turísticos",
          "Parque Nacional da Serra da Capivara; Pedra Furada; Pinturas Rupestres; Serra Vermelha."
        ],

        [
          "Cultura e alimentação",
          "Carne de sol com macaxeira, feijoada, peixes do rio, milho, arroz, feijão e queijo coalho."
        ]
      ],

      links: []
    },

    "joao pessoa": {
      nome: "João Pessoa",

      secoes: [
        [
          "Transporte",
          "De avião, ida e volta por R$ 1.737."
        ],

        [
          "Estadia",
          "Hotel em João Pessoa por R$ 166 a diária."
        ],

        [
          "Alimentação",
          "Rubacão, carne de sol, arrumadinho, tapioca, cuscuz e cartola."
        ],

        [
          "Pontos turísticos",
          "Centro Histórico; piscinas naturais dos Seixas; praias de Cabo Branco e Tambaú; Farol do Cabo Branco; pôr do sol."
        ],

        [
          "Cultura",
          "Mistura de influências indígenas, africanas e portuguesas, com artesanato popular, forró, coco de roda e ciranda."
        ]
      ],

      links: [
        [
          "Pesquisar passagem",
          "https://flights.booking.com/"
        ],

        [
          "JR Hotel no Hoteis.com",
          "https://www.hoteis.com/ho412766/jr-hotel-joao-pessoa-brasil/"
        ]
      ]
    },

    "baia da traicao": {
      nome: "Baía da Traição",

      secoes: [
        [
          "Local",
          "Litoral norte do estado da Paraíba, a cerca de 90 km da capital João Pessoa."
        ],

        [
          "Hospedagem",
          "A melhor área citada para se hospedar é na Praia do Centro e Praia do Forte."
        ],

        [
          "Transporte",
          "A passagem até João Pessoa está a partir de R$ 2.071. A cidade fica a cerca de 82 km."
        ],

        [
          "Lugares para visitar",
          "Praias de Baía da Traição; Praia do Forte; Prainha; Praia do Porto; praias selvagens e de surfe."
        ],

        [
          "Restaurantes",
          "Bar e Restaurante Trincheiras; Mirante Restaurante."
        ],

        [
          "Cultura",
          "Herança indígena Potiguara e influência portuguesa, com manifestações como toré e coco de roda."
        ]
      ],

      links: []
    },

    galinhos: {
      nome: "Galinhos",

      secoes: [
        [
          "Local",
          "Rio Grande do Norte."
        ],

        [
          "Transporte",
          "De São Paulo até Galinhos: R$ 1.265 a R$ 3.209 usando ônibus, avião e táxi."
        ],

        [
          "Estadia",
          "Pousada Golfinho: 7 dias por R$ 1.176 para 2 pessoas."
        ],

        [
          "Alimentação",
          "Peixes, camarões, ostras e outros frutos do mar frescos."
        ],

        [
          "Pontos turísticos",
          "Praia de Galinhos, Dunas de Galinhos e Praia Gaias."
        ],

        [
          "Cultura",
          "Pesca tradicional, passeios de charrete e forte ligação com a natureza."
        ]
      ],

      links: []
    }
  };

  // =========================================================
  // CRIAR CARDS DAS OFERTAS
  // =========================================================

  function criarBlocoSecao(
    titulo,
    texto
  ) {
    const bloco =
      document.createElement("section");

    bloco.className =
      "oferta-bloco";

    const h3 =
      document.createElement("h3");

    h3.textContent = titulo;

    const p =
      document.createElement("p");

    p.textContent = texto;

    bloco.appendChild(h3);
    bloco.appendChild(p);

    return bloco;
  }

  // =========================================================
  // DESTAQUES AO LADO DA IMAGEM
  // =========================================================

  function criarDestaques(dados) {
    if (!ofertaDestaques) return;

    ofertaDestaques.innerHTML = "";

    const titulosPrioritarios = [
      "Voos",
      "Voos e acesso",
      "Transporte",
      "Preço para ir",
      "Estadia",
      "Hotel",
      "Hospedagem",
      "Local"
    ];

    const destaques =
      dados.secoes
        .filter(function (secao) {
          return titulosPrioritarios.includes(
            secao[0]
          );
        })
        .slice(0, 3);

    destaques.forEach(
      function (secao) {
        const item =
          document.createElement("div");

        item.className =
          "oferta-destaque-item";

        const titulo =
          document.createElement("span");

        titulo.className =
          "oferta-destaque-titulo";

        titulo.textContent =
          secao[0];

        const texto =
          document.createElement("strong");

        texto.className =
          "oferta-destaque-texto";

        texto.textContent =
          secao[1];

        item.appendChild(titulo);
        item.appendChild(texto);

        ofertaDestaques.appendChild(item);
      }
    );
  }

  // =========================================================
  // ABRIR VER OFERTAS
  // =========================================================

  function abrirOferta(
    nomeCidade,
    imagemSrc,
    imagemAlt
  ) {
    if (
      !modalOfertas ||
      !ofertaTitulo ||
      !ofertaConteudo
    ) {
      return;
    }

    const chave =
      normalizar(nomeCidade);

    const dados =
      dadosDestinos[chave];

    if (!dados) {
      mostrarMensagem(
        "Ainda não há detalhes cadastrados para esse destino."
      );

      return;
    }

    ofertaTitulo.textContent =
      dados.nome;

    ofertaConteudo.innerHTML = "";

    // Coloca a imagem do card no modal

    if (ofertaImagem) {
      ofertaImagem.src =
        imagemSrc || "";

      ofertaImagem.alt =
        imagemAlt ||
        "Imagem de " + dados.nome;
    }

    criarDestaques(dados);

    // Cria os cards de informações

    dados.secoes.forEach(
      function (secao) {
        ofertaConteudo.appendChild(
          criarBlocoSecao(
            secao[0],
            secao[1]
          )
        );
      }
    );

    // =====================================================
    // LINKS
    // =====================================================

    const linksBox =
      document.createElement("section");

    linksBox.className =
      "oferta-bloco oferta-links";

    const h3 =
      document.createElement("h3");

    h3.textContent =
      "Links pesquisados";

    linksBox.appendChild(h3);

    if (!dados.links.length) {
      const p =
        document.createElement("p");

      p.textContent =
        "Nenhum link foi incluído nas anotações para este destino.";

      linksBox.appendChild(p);
    } else {
      const lista =
        document.createElement("div");

      lista.className =
        "lista-links-oferta";

      dados.links.forEach(
        function (link) {
          const a =
            document.createElement("a");

          a.href = link[1];

          a.target = "_blank";

          a.rel =
            "noopener noreferrer";

          a.textContent =
            link[0];

          lista.appendChild(a);
        }
      );

      linksBox.appendChild(lista);
    }

    ofertaConteudo.appendChild(
      linksBox
    );

    modalOfertas.hidden = false;

    document.body.classList.add(
      "modal-aberto"
    );

    if (fecharOfertas) {
      fecharOfertas.focus();
    }
  }

  // =========================================================
  // BOTÕES VER OFERTAS
  // =========================================================

  document
    .querySelectorAll(".ver-ofertas")
    .forEach(function (botao) {
      botao.addEventListener(
        "click",
        function () {
          const cidade =
            botao.closest(".cidade");

          if (!cidade) return;

          const titulo =
            cidade.querySelector(
              ":scope > h3"
            );

          const imagem =
            cidade.querySelector("img");

          if (!titulo) return;

          abrirOferta(
            titulo.textContent.trim(),

            imagem
              ? imagem.src
              : "",

            imagem
              ? imagem.alt
              : ""
          );
        }
      );
    });

  // =========================================================
  // FECHAR MODAL
  // =========================================================

  function fecharModalOferta() {
    if (!modalOfertas) return;

    modalOfertas.hidden = true;

    document.body.classList.remove(
      "modal-aberto"
    );
  }

  if (fecharOfertas) {
    fecharOfertas.addEventListener(
      "click",
      fecharModalOferta
    );
  }

  if (modalOfertas) {
    modalOfertas.addEventListener(
      "click",
      function (evento) {
        if (
          evento.target ===
          modalOfertas
        ) {
          fecharModalOferta();
        }
      }
    );
  }

  document.addEventListener(
    "keydown",
    function (evento) {
      if (
        evento.key === "Escape" &&
        modalOfertas &&
        !modalOfertas.hidden
      ) {
        fecharModalOferta();
      }
    }
  );

  // =========================================================
  // PREÇOS
  // =========================================================

  const precosIniciais = {
    fortaleza: 1888.01,

    "baia da traicao": 2071,

    maceio: 2000,

    "canoa quebrada": 884,

    "croa da baleia": 3107,

    teresina: 1258.54,

    "sao raimundo nonato": 500,

    "joao pessoa": 1737,

    galinhos: 1265
  };

  // =========================================================
  // BENEFÍCIOS
  // =========================================================

  function mostrarPainelBeneficio(
    titulo,
    texto,
    acaoTexto,
    acao
  ) {
    if (!painelBeneficio) return;

    beneficioTitulo.textContent =
      titulo;

    beneficioTexto.textContent =
      texto;

    beneficioAcao.textContent =
      acaoTexto;

    beneficioAcao.onclick =
      acao;

    painelBeneficio.hidden =
      false;

    painelBeneficio.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  botoesBeneficio.forEach(
    function (botao) {
      botao.addEventListener(
        "click",
        function () {
          botoesBeneficio.forEach(
            function (item) {
              item.classList.remove(
                "beneficio-ativo"
              );
            }
          );

          botao.classList.add(
            "beneficio-ativo"
          );

          const tipo =
            botao.dataset.beneficio;

          // ===============================================
          // BUSCA RÁPIDA
          // ===============================================

          if (tipo === "busca") {
            mostrarPainelBeneficio(
              "Busca rápida",

              "Use a pesquisa do topo para encontrar qualquer destino cadastrado. As sugestões aparecem enquanto você digita.",

              "Ir para a busca",

              function () {
                const hero =
                  document.querySelector(
                    ".hero"
                  );

                if (hero) {
                  hero.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }

                setTimeout(
                  function () {
                    if (campoBusca) {
                      campoBusca.focus();

                      renderizarSugestoes(
                        campoBusca.value
                      );
                    }
                  },
                  450
                );
              }
            );
          }

          // ===============================================
          // MENOR PREÇO
          // ===============================================

          if (tipo === "preco") {
            const menor =
              Object.entries(
                precosIniciais
              ).sort(
                function (a, b) {
                  return a[1] - b[1];
                }
              )[0];

            const cidadeMenor =
              cidades.find(
                function (cidade) {
                  const titulo =
                    cidade.querySelector(
                      ":scope > h3"
                    );

                  return (
                    titulo &&
                    normalizar(
                      titulo.textContent
                    ) === menor[0]
                  );
                }
              );

            const nomeMenor =
              cidadeMenor
                ? cidadeMenor
                    .querySelector(
                      ":scope > h3"
                    )
                    .textContent
                    .trim()
                : "destino";

            const valor =
              menor[1].toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL"
                }
              );

            mostrarPainelBeneficio(
              "Menor preço entre os valores cadastrados",

              nomeMenor +
                " possui o menor valor inicial cadastrado: " +
                valor +
                ". Os tipos de transporte e condições podem variar entre os destinos.",

              "Ver esse destino",

              function () {
                pesquisarCidade(
                  nomeMenor
                );
              }
            );
          }

          // ===============================================
          // COMPRA SEGURA
          // ===============================================

          if (
            tipo ===
            "seguranca"
          ) {
            mostrarPainelBeneficio(
              "Compra segura",

              "Antes de pagar, confira datas, aeroporto ou rodoviária, política de cancelamento, dados do viajante e o endereço do site. A New Airs organiza as informações e os links pesquisados; a compra é feita no site externo escolhido.",

              "Ver destinos e links",

              function () {
                const destinos =
                  document.getElementById(
                    "destinos"
                  );

                if (destinos) {
                  destinos.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }
              }
            );
          }
        }
      );
    }
  );

  // =========================================================
  // ESTRELAS DA AVALIAÇÃO
  // =========================================================

  function atualizarEstrelas(valor) {
    estrelasAvaliacao.forEach(
      function (estrela) {
        const ativa =
          Number(
            estrela.dataset.valor
          ) <= valor;

        estrela.classList.toggle(
          "selecionada",
          ativa
        );

        estrela.setAttribute(
          "aria-checked",

          Number(
            estrela.dataset.valor
          ) === valor
            ? "true"
            : "false"
        );
      }
    );
  }

  estrelasAvaliacao.forEach(
    function (estrela) {
      estrela.addEventListener(
        "click",
        function () {
          notaSelecionada =
            Number(
              estrela.dataset.valor
            );

          atualizarEstrelas(
            notaSelecionada
          );

          if (statusAvaliacao) {
            statusAvaliacao.textContent =
              notaSelecionada +
              " de 5 estrelas selecionadas.";
          }
        }
      );
    }
  );

  // =========================================================
  // CONTADOR DA AVALIAÇÃO
  // =========================================================

  if (
    textoAvaliacao &&
    contadorAvaliacao
  ) {
    textoAvaliacao.addEventListener(
      "input",
      function () {
        contadorAvaliacao.textContent =
          textoAvaliacao.value.length +
          "/500";
      }
    );
  }

  // =========================================================
  // CRIAR ESTRELAS DOS COMENTÁRIOS
  // =========================================================

  function criarEstrelasNota(nota) {
    const span =
      document.createElement("span");

    span.className = "nota";

    span.setAttribute(
      "role",
      "img"
    );

    span.setAttribute(
      "aria-label",
      nota + " de 5 estrelas"
    );

    for (
      let i = 1;
      i <= 5;
      i++
    ) {
      const svg =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );

      svg.setAttribute(
        "class",
        "icone"
      );

      if (i > nota) {
        svg.classList.add(
          "estrela-inativa"
        );
      }

      const use =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "use"
        );

      use.setAttribute(
        "href",
        "#i-estrela"
      );

      svg.appendChild(use);

      span.appendChild(svg);
    }

    return span;
  }

  // =========================================================
  // VEJA MAIS AVALIAÇÕES
  // =========================================================

  function atualizarVisibilidadeAvaliacoes() {
    if (!listaDepoimentos) return;

    const depoimentos =
      Array.from(
        listaDepoimentos.querySelectorAll(
          ".depoimento"
        )
      );

    depoimentos.forEach(
      function (
        depoimento,
        indice
      ) {
        const deveOcultar =
          !avaliacoesExpandidas &&
          indice >=
            limiteAvaliacoesVisiveis;

        depoimento.classList.toggle(
          "avaliacao-oculta",
          deveOcultar
        );
      }
    );

    if (!botaoMaisAvaliacoes) {
      return;
    }

    // Se houver só duas ou menos,
    // não mostra o botão.

    if (
      depoimentos.length <=
      limiteAvaliacoesVisiveis
    ) {
      botaoMaisAvaliacoes.hidden =
        true;

      return;
    }

    botaoMaisAvaliacoes.hidden =
      false;

    botaoMaisAvaliacoes.setAttribute(
      "aria-expanded",
      String(
        avaliacoesExpandidas
      )
    );

    botaoMaisAvaliacoes.textContent =
      avaliacoesExpandidas
        ? "Ver menos avaliações"
        : "Veja mais avaliações";
  }

  if (botaoMaisAvaliacoes) {
    botaoMaisAvaliacoes.addEventListener(
      "click",
      function () {
        avaliacoesExpandidas =
          !avaliacoesExpandidas;

        atualizarVisibilidadeAvaliacoes();

        // Ao clicar em Ver menos,
        // volta para o início das avaliações.

        if (
          !avaliacoesExpandidas &&
          listaDepoimentos
        ) {
          listaDepoimentos.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    );
  }

  // =========================================================
  // CRIAR AVALIAÇÃO NA TELA
  // =========================================================

  function renderizarAvaliacao(
    avaliacao,
    adicionarNoTopo
  ) {
    if (!listaDepoimentos) return;

    const bloco =
      document.createElement(
        "blockquote"
      );

    bloco.className =
      "depoimento depoimento-usuario";

    const comentario =
      document.createElement("p");

    comentario.textContent =
      avaliacao.texto;

    const autor =
      document.createElement("cite");

    autor.className =
      "autor";

    autor.appendChild(
      criarEstrelasNota(
        avaliacao.nota
      )
    );

    const nome =
      document.createElement("span");

    nome.textContent =
      avaliacao.nome ||
      "Viajante anônimo";

    autor.appendChild(nome);

    bloco.appendChild(
      comentario
    );

    bloco.appendChild(
      autor
    );

    if (
      adicionarNoTopo &&
      listaDepoimentos.firstChild
    ) {
      listaDepoimentos.insertBefore(
        bloco,
        listaDepoimentos.firstChild
      );
    } else {
      listaDepoimentos.appendChild(
        bloco
      );
    }

    atualizarVisibilidadeAvaliacoes();
  }

  // =========================================================
  // CARREGAR AVALIAÇÕES SALVAS
  // =========================================================

  function carregarAvaliacoes() {
    try {
      const salvas =
        JSON.parse(
          localStorage.getItem(
            "newAirsAvaliacoes"
          ) || "[]"
        );

      salvas.forEach(
        function (avaliacao) {
          renderizarAvaliacao(
            avaliacao,
            true
          );
        }
      );

      atualizarVisibilidadeAvaliacoes();

    } catch (erro) {
      console.warn(
        "Não foi possível carregar avaliações salvas.",
        erro
      );
    }
  }

  // =========================================================
  // ENVIAR AVALIAÇÃO
  // =========================================================

  if (formAvaliacao) {
    formAvaliacao.addEventListener(
      "submit",
      function (evento) {
        evento.preventDefault();

        const texto =
          textoAvaliacao.value.trim();

        const nome =
          nomeAvaliacao.value.trim();

        // Precisa escolher estrelas

        if (!notaSelecionada) {
          statusAvaliacao.textContent =
            "Escolha de 1 a 5 estrelas antes de enviar.";

          return;
        }

        // Precisa escrever comentário

        if (!texto) {
          statusAvaliacao.textContent =
            "Escreva um comentário antes de enviar.";

          textoAvaliacao.focus();

          return;
        }

        const avaliacao = {
          nome: nome,

          nota:
            notaSelecionada,

          texto: texto
        };

        // =================================================
        // SALVAR NO NAVEGADOR
        // =================================================

        try {
          const salvas =
            JSON.parse(
              localStorage.getItem(
                "newAirsAvaliacoes"
              ) || "[]"
            );

          salvas.push(
            avaliacao
          );

          localStorage.setItem(
            "newAirsAvaliacoes",

            JSON.stringify(
              salvas
            )
          );

        } catch (erro) {
          console.warn(
            "A avaliação será exibida nesta sessão, mas não pôde ser salva.",
            erro
          );
        }

        // Mostra no topo

        renderizarAvaliacao(
          avaliacao,
          true
        );

        // Limpa formulário

        formAvaliacao.reset();

        notaSelecionada = 0;

        atualizarEstrelas(0);

        if (contadorAvaliacao) {
          contadorAvaliacao.textContent =
            "0/500";
        }

        if (statusAvaliacao) {
          statusAvaliacao.textContent =
            "Avaliação publicada em “O que nossos viajantes falam?”.";
        }

        // Vai para as avaliações

        const beneficios =
          document.getElementById(
            "beneficios"
          );

        if (beneficios) {
          beneficios.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    );
  }

  // =========================================================
  // INICIAR
  // =========================================================

  carregarAvaliacoes();

  atualizarVisibilidadeAvaliacoes();
});