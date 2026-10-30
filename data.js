const EDITAL = 'https://cdn.cebraspe.org.br/concursos/ADEAL_26/arquivos/B77102106228ED45E12CC18C9A22A1E3B2230241E995BF594F69AE88A34D1AF1.pdf';
const TOPICS = [
 {id:'epi',name:'Epidemiologia e diagnóstico',group:'Específicos',detail:'Medidas epidemiológicas, risco, amostragem e testes.'},
 {id:'san',name:'Sanidade e programas animais',group:'Específicos',detail:'Enfermidades, zoonoses, notificações, programas oficiais, PNEFA, PNCEBT, peste suína e influenza aviária.'},
 {id:'alim',name:'Alimentos e inspeção',group:'Específicos',detail:'Tecnologia, inspeção, microbiologia, identidade, qualidade, resíduos, contaminantes e doenças alimentares.'},
 {id:'auto',name:'BPF, PPHO e autocontrole',group:'Específicos',detail:'Higiene, APPCC e controle dos processos.'},
 {id:'farm',name:'Produtos veterinários',group:'Específicos',detail:'Fiscalização, antimicrobianos, antiparasitários, vacinas e antígenos.'},
 {id:'intern',name:'Vigilância e organismos internacionais',group:'Específicos',detail:'OMSA, OPAS, FAO e Codex Alimentarius.'},
 {id:'legvet',name:'Legislação veterinária',group:'Específicos',detail:'Exercício profissional, legislação estadual, RIISPOA, SUASA e identificação animal.'},
 {id:'port',name:'Língua Portuguesa',group:'Básicos',detail:'Interpretação, coesão, sintaxe, concordância e reescrita.'},
 {id:'log',name:'Raciocínio lógico-matemático',group:'Básicos',detail:'Proposições, porcentagens, probabilidade e matemática.'},
 {id:'al',name:'Conhecimentos de Alagoas',group:'Básicos',detail:'História, geografia, economia, cultura e Constituição estadual.'},
 {id:'info',name:'Informática',group:'Básicos',detail:'Sistemas, aplicativos, redes, segurança e IA.'},
 {id:'leg',name:'Legislação federal',group:'Básicos',detail:'Defesa animal e vegetal; política agrícola.'}
];
const SOURCES = {
 fda:{title:'FDA — Desempenho de testes diagnósticos',url:'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/statistical-guidance-reporting-results-studies-evaluating-diagnostic-tests-guidance-industry-and-fda'},
 mapa:{title:'MAPA — PNCEBT: abrangência e objetivos',url:'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/pncebt/tb-1-pncebt.pdf'},
 who:{title:'OMS — Cinco chaves para alimentos seguros',url:'https://www.who.int/activities/promoting-safe-food-handling/five-key-to-safer-food'},
 whop:{title:'OMS — Cartaz e fundamentos de segurança alimentar',url:'https://www.who.int/docs/librariesprovider2/default-document-library/5keys_en.pdf'},
 own:{title:'Exercício autoral — resolução no comentário',url:''}
};
const RAW_QUESTIONS = [
 ['epi','A sensibilidade de um teste corresponde à proporção de resultados positivos entre os indivíduos que apresentam a condição investigada.',true,'O denominador é o grupo com a condição: sensibilidade = verdadeiros positivos / (verdadeiros positivos + falsos negativos).','fda'],
 ['epi','Um teste com especificidade de 95% produzirá, necessariamente, resultado positivo em 95% dos animais doentes.',false,'Especificidade mede resultados negativos entre os indivíduos sem a condição, e não os positivos entre doentes.','fda'],
 ['epi','Se 90 de 100 animais comprovadamente doentes têm resultado positivo, a sensibilidade observada é de 90%.',true,'A divisão de 90 positivos pelos 100 doentes resulta em 0,90.','fda'],
 ['epi','Em 200 animais sem a condição investigada, 10 resultados positivos correspondem a uma especificidade observada de 5%.',false,'Há 190 verdadeiros negativos: 190 / 200 = 95% de especificidade. Os 5% são a proporção de falsos positivos.','fda'],
 ['san','A abrangência do PNCEBT inclui a brucelose e a tuberculose em bovinos e bubalinos.',true,'O programa se dirige ao controle e à erradicação dessas duas enfermidades nessas populações.','mapa'],
 ['san','Brucella abortus e Mycobacterium bovis são vírus contemplados pelo PNCEBT.',false,'Ambos são bactérias, associadas respectivamente à brucelose e à tuberculose bovina.','mapa'],
 ['san','Reduzir a incidência e a prevalência da brucelose e da tuberculose bovina e bubalina integra o objetivo do PNCEBT.',true,'A redução de ambas as medidas faz parte do objetivo de avançar para a erradicação.','mapa'],
 ['san','A epididimite ovina por Brucella ovis está incluída nas medidas propostas pelo PNCEBT da mesma forma que a brucelose bovina.',false,'O documento do MAPA a distingue e situa seu controle no programa de sanidade de caprinos e ovinos.','mapa'],
 ['auto','Separar alimentos crus dos prontos para consumo é uma medida para reduzir a contaminação cruzada.',true,'A separação dificulta a transferência de microrganismos dos alimentos crus para os preparados.','who'],
 ['auto','Água segura e matérias-primas adequadas fazem parte das recomendações de segurança alimentar da OMS.',true,'A seleção da água e dos insumos integra as cinco chaves de prevenção.','who'],
 ['auto','A cocção adequada dispensa os cuidados de higiene durante a manipulação posterior do alimento.',false,'Higiene, separação, cocção e conservação são cuidados complementares. Um alimento pode ser contaminado após o preparo.','who'],
 ['auto','Manter alimentos em temperaturas seguras é uma das cinco chaves propostas pela OMS.',true,'A orientação inclui temperatura, além de limpeza, separação, cocção e escolha de insumos.','who'],
 ['alim','Refrigerar um alimento garante que nenhum microrganismo perigoso possa crescer nele.',false,'A refrigeração reduz a multiplicação, mas alguns microrganismos ainda podem crescer em baixas temperaturas.','whop'],
 ['alim','Utensílios usados em alimentos crus podem transferir microrganismos a alimentos preparados.',true,'Tábuas, facas e outros utensílios podem funcionar como veículos de contaminação.','whop'],
 ['alim','Alimentos refrigerados podem ser armazenados por tempo indefinido, sem risco sanitário.',false,'A conservação sob refrigeração não elimina o limite de tempo de armazenamento seguro.','whop'],
 ['alim','Água e gelo podem introduzir contaminação nos alimentos.',true,'A segurança da água também importa quando ela é usada para produzir gelo.','whop'],
 ['log','Em um lote de 250 amostras, 20% correspondem a 50 amostras.',true,'250 × 0,20 = 50.','own'],
 ['log','Um aumento de 10% seguido de uma redução de 10% devolve uma quantidade ao seu valor inicial.',false,'As bases mudam: 100 × 1,10 × 0,90 = 99. A redução final é de 1%.','own'],
 ['log','A negação de “todos os lotes foram inspecionados” é “nenhum lote foi inspecionado”.',false,'Basta um contraexemplo: a negação é “pelo menos um lote não foi inspecionado”.','own'],
 ['log','A proposição “se P, então Q” é falsa quando P é verdadeira e Q é falsa.',true,'Essa é a única combinação que torna falsa a implicação material.','own'],
 ['log','Escolhendo ao acaso um elemento de um conjunto de 10 elementos equiprováveis, dos quais 3 são especiais, a probabilidade de obter um especial é 30%.',true,'São 3 resultados favoráveis entre 10 possíveis: 3/10 = 0,30.','own'],
 ['log','A negação de “P e Q” é logicamente equivalente a “não P e não Q”.',false,'Pela lei de de Morgan, a negação é “não P ou não Q”.','own'],
 ['port','Na frase “Havia irregularidades no estabelecimento”, o verbo haver, no sentido de existir, está corretamente no singular.',true,'Com sentido de existir, haver é impessoal e permanece na terceira pessoa do singular.','own'],
 ['port','Em “Os fiscais analisaram os documentos”, “os documentos” exerce a função de sujeito.',false,'O sujeito é “os fiscais”; “os documentos” é objeto direto do verbo analisar.','own'],
 ['port','A substituição de “porém” por “portanto” preserva necessariamente o sentido de uma oração.',false,'“Porém” introduz oposição; “portanto” normalmente introduz conclusão.','own'],
 ['port','A frase “Faz dois anos que o estabelecimento foi vistoriado” emprega corretamente o verbo fazer no singular.',true,'Fazer, na indicação de tempo decorrido, é impessoal.','own']
];
const SEED = RAW_QUESTIONS.map((q,i)=>({id:'campo-'+(i+1),topic:q[0],text:q[1],answer:q[2],explanation:q[3],source:SOURCES[q[4]],origin:'Autoral • treino introdutório'}));
const PROMPTS = [
 {id:'p1',title:'Prevenção de contaminação cruzada',text:'Explique como a organização dos fluxos, a higiene de utensílios e a capacitação dos manipuladores contribuem para prevenir a contaminação cruzada em estabelecimentos de produtos de origem animal.',checks:['Defini o problema de contaminação cruzada.','Relacionei fluxos, utensílios e higiene.','Apresentei medidas de capacitação e verificação.','Revisei a coerência, a gramática e a conclusão.']},
 {id:'p2',title:'Interpretação de testes diagnósticos',text:'Discuta o significado de sensibilidade e especificidade e as consequências de resultados falsos positivos e falsos negativos em ações de defesa sanitária animal.',checks:['Distingui sensibilidade de especificidade.','Expliquei os dois tipos de erro.','Relacionei os resultados à tomada de decisão sanitária.','Revisei a coerência, a gramática e a conclusão.']},
 {id:'p3',title:'Programas de sanidade animal',text:'Apresente os objetivos do PNCEBT e discuta a importância da informação epidemiológica para planejar e avaliar ações de controle de doenças em rebanhos.',checks:['Delimitei as espécies e enfermidades do programa.','Expliquei os objetivos sanitários.','Relacionei indicadores epidemiológicos à avaliação das ações.','Revisei a coerência, a gramática e a conclusão.']}
];
