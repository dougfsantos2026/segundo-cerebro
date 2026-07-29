import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Gauge,
  LifeBuoy,
  MapPin,
  RefreshCw,
  Search,
  ShoppingBag,
  Target,
} from "lucide-react";

export type Servico = {
  slug: string;
  titulo: string;
  descricao: string;
  beneficios: string[];
  icone: LucideIcon;
};

export const servicos: Servico[] = [
  {
    slug: "site-institucional",
    titulo: "Site institucional",
    descricao:
      "A presença digital completa da sua empresa: quem você é, o que faz e por que confiar no seu trabalho.",
    beneficios: [
      "Páginas de serviços e sobre",
      "Formulário de contato integrado",
      "Estrutura pronta para crescer",
    ],
    icone: Building2,
  },
  {
    slug: "landing-page",
    titulo: "Landing page",
    descricao:
      "Uma página única e objetiva, feita para campanhas e para transformar visitas em contatos.",
    beneficios: [
      "Foco total em conversão",
      "Ideal para anúncios pagos",
      "Publicação rápida",
    ],
    icone: Target,
  },
  {
    slug: "negocio-local",
    titulo: "Site para negócio local",
    descricao:
      "Para quem atende presencialmente e precisa ser encontrado por quem está por perto.",
    beneficios: [
      "Mapa, horários e endereço",
      "Botão de WhatsApp em destaque",
      "Perfil do Google configurado",
    ],
    icone: MapPin,
  },
  {
    slug: "loja-virtual",
    titulo: "Loja virtual",
    descricao:
      "Catálogo online com checkout, para vender seus produtos sem depender só do direct.",
    beneficios: [
      "Catálogo organizado",
      "Meios de pagamento",
      "Cálculo de frete",
    ],
    icone: ShoppingBag,
  },
  {
    slug: "reformulacao",
    titulo: "Reformulação de site",
    descricao:
      "Seu site já existe, mas envelheceu. Reconstruímos mantendo o que funciona e o histórico no Google.",
    beneficios: [
      "Visual moderno",
      "Migração sem perder posições",
      "Conteúdo reorganizado",
    ],
    icone: RefreshCw,
  },
  {
    slug: "manutencao",
    titulo: "Manutenção e suporte",
    descricao:
      "Atualizações, ajustes de conteúdo e monitoramento para o site nunca ficar parado no tempo.",
    beneficios: [
      "Atualizações de segurança",
      "Ajustes de conteúdo",
      "Backup periódico",
    ],
    icone: LifeBuoy,
  },
  {
    slug: "performance",
    titulo: "Otimização de velocidade",
    descricao:
      "Diagnóstico e correção do que deixa seu site lento — a principal causa de visitas perdidas.",
    beneficios: [
      "Imagens otimizadas",
      "Carregamento mais leve",
      "Melhora nas Core Web Vitals",
    ],
    icone: Gauge,
  },
  {
    slug: "seo",
    titulo: "SEO e estrutura para Google",
    descricao:
      "Fundamentos técnicos para o Google entender seu site e mostrá-lo para quem procura seus serviços.",
    beneficios: [
      "Títulos e descrições únicos",
      "Dados estruturados",
      "Sitemap e indexação",
    ],
    icone: Search,
  },
];
