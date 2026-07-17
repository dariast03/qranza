import {
	BarChart3,
	Bell,
	Building2,
	ClipboardList,
	CreditCard,
	Globe,
	Home,
	Layers,
	type LucideIcon,
	Package,
	Percent,
	Ruler,
	Settings,
	Settings2,
	Shield,
	Store,
	SubscriptIcon,
	Users,
	UserCircle,
	UserCog,
	Warehouse,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export type AppPath = string;

export interface NavSubItem {
	id: string;
	title: string;
	url: AppPath;
	icon?: LucideIcon;
	badge?: NavBadge;
	disabled?: boolean;
	newTab?: boolean;
	subItems?: NavSubItem[];
}

interface NavItemBase {
	id: string;
	title: string;
	icon?: LucideIcon;
	badge?: NavBadge;
	disabled?: boolean;
	newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
	url: AppPath;
	subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
	subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
	id: number;
	label?: string;
	items: NavMainItem[];
}

export function getSidebarItems(t: (key: string) => string): NavGroup[] {
	return [
		{
			id: 1,
			items: [
				{
					id: "inicio",
					title: t("app.sidebar.home"),
					url: "/app",
					icon: Home,
				},
				{
					id: "catalogo",
					title: t("app.sidebar.catalog.label"),
					icon: Package,
					subItems: [
						{
							id: "articulos",
							title: t("app.sidebar.catalog.items"),
							url: "/app/item/all",
						},
						{
							id: "galeria",
							title: t("app.sidebar.catalog.gallery"),
							url: "/app/item/gallery",
						},
						{
							id: "modificadores",
							title: t("app.sidebar.catalog.modifiers"),
							url: "/app/item/modifiers",
						},
						{
							id: "categorias",
							title: t("app.sidebar.catalog.categories"),
							url: "/app/item/categories",
						},
						{
							id: "descuentos",
							title: t("app.sidebar.catalog.discounts"),
							url: "/app/item/discounts",
						},
						{
							id: "variantes",
							title: t("app.sidebar.catalog.variants"),
							url: "/app/item/variants",
						},
						{
							id: "unidades",
							title: t("app.sidebar.catalog.units"),
							url: "/app/item/units",
						},
						{
							id: "atributos-personalizados",
							title: t("app.sidebar.catalog.customAttributes"),
							url: "/app/item/custom-attributes",
						},
						{
							id: "inventario",
							title: t("app.sidebar.catalog.inventory"),
							url: "/app/item/inventory",
						},
						{
							id: "ajustes-catalogo",
							title: t("app.sidebar.catalog.settings"),
							url: "/app/item/settings",
						},
					],
				},
				{
					id: "ordenes",
					title: t("app.sidebar.orders.label"),
					icon: ClipboardList,
					subItems: [
						{
							id: "pedidos",
							title: t("app.sidebar.orders.list"),
							url: "/app/orders",
						},
						{
							id: "devoluciones",
							title: t("app.sidebar.orders.returns"),
							url: "/app/orders/returns",
						},
						{
							id: "envios",
							title: t("app.sidebar.orders.shipping"),
							url: "/app/orders/shipping",
						},
						{
							id: "pagos",
							title: t("app.sidebar.orders.payments"),
							url: "/app/orders/payments",
						},
						{
							id: "abonos",
							title: t("app.sidebar.orders.partialPayments"),
							url: "/app/orders/partial-payments",
						},
					],
				},
				{
					id: "clientes",
					title: t("app.sidebar.customers"),
					url: "/app/customers",
					icon: Users,
				},
				{
					id: "reportes",
					title: t("app.sidebar.reports.label"),
					icon: BarChart3,
					subItems: [
						{
							id: "ventas",
							title: t("app.sidebar.reports.sales"),
							url: "/app/reports/sales",
						},
						{
							id: "reporte-inventario",
							title: t("app.sidebar.reports.inventory"),
							url: "/app/reports/inventory",
						},
						{
							id: "reporte-clientes",
							title: t("app.sidebar.reports.customers"),
							url: "/app/reports/customers",
						},
						{
							id: "reporte-productos",
							title: t("app.sidebar.reports.products"),
							url: "/app/reports/products",
						},
					],
				},
				{
					id: "personal",
					title: t("app.sidebar.team.label"),
					icon: UserCog,
					subItems: [
						{
							id: "miembros",
							title: t("app.sidebar.team.members"),
							url: "/app/team/members",
						},
						{
							id: "permisos",
							title: t("app.sidebar.team.permissions"),
							url: "/app/team/permissions",
						},
					],
				},
				{
					id: "ajustes",
					title: t("app.sidebar.settings.label"),
					icon: Settings,
					subItems: [
						{
							id: "mi-cuenta",
							title: t("app.sidebar.settings.myAccount.label"),
							url: "#",
							icon: UserCircle,
							subItems: [
								{
									id: "informacion-personal",
									title: t("app.sidebar.settings.myAccount.personalInfo"),
									url: "/app/settings/account/profile",
								},
								{
									id: "seguridad",
									title: t("app.sidebar.settings.myAccount.security"),
									url: "/app/settings/account/security",
								},
								{
									id: "preferencias",
									title: t("app.sidebar.settings.myAccount.preferences"),
									url: "/app/settings/account/preferences",
								},
							],
						},
						{
							id: "mi-negocio",
							title: t("app.sidebar.settings.myBusiness.label"),
							url: "#",
							icon: Building2,
							subItems: [
								{
									id: "informacion",
									title: t("app.sidebar.settings.myBusiness.information"),
									url: "/app/settings/business/info",
								},
								{
									id: "sucursales",
									title: t("app.sidebar.settings.myBusiness.locations"),
									url: "/app/settings/business/locations",
								},
							],
						},
						{
							id: "facturacion",
							title: t("app.sidebar.settings.billing"),
							url: "/app/settings/billing",
							icon: CreditCard,
						},
						{
							id: "planes-y-suscripciones",
							title: t("app.sidebar.settings.plansAndSubscriptions"),
							url: "/app/settings/subscriptions",
							icon: SubscriptIcon,
						},
						{
							id: "notificaciones",
							title: t("app.sidebar.settings.notifications"),
							url: "/app/settings/notifications",
							icon: Bell,
						},
					],
				},
			],
		},
		{
			id: 2,
			label: t("app.sidebar.salesChannels.label"),
			items: [
				{
					id: "sitio-web",
					title: t("app.sidebar.salesChannels.website.label"),
					icon: Globe,
					subItems: [
						{
							id: "tienda",
							title: t("app.sidebar.salesChannels.website.storefront"),
							url: "/app/channels/web/storefront",
						},
						{
							id: "checkout",
							title: t("app.sidebar.salesChannels.website.checkout"),
							url: "/app/channels/web/checkout",
						},
						{
							id: "tema",
							title: t("app.sidebar.salesChannels.website.theme"),
							url: "/app/channels/web/theme",
						},
						{
							id: "paginas",
							title: t("app.sidebar.salesChannels.website.pages"),
							url: "/app/channels/web/pages",
						},
						{
							id: "navegacion",
							title: t("app.sidebar.salesChannels.website.navigation"),
							url: "/app/channels/web/navigation",
						},
						{
							id: "seo",
							title: t("app.sidebar.salesChannels.website.seo"),
							url: "/app/channels/web/seo",
						},
						{
							id: "dominios",
							title: t("app.sidebar.salesChannels.website.domains"),
							url: "/app/channels/web/domains",
						},
						{
							id: "notificaciones-web",
							title: t("app.sidebar.salesChannels.website.notifications"),
							url: "/app/channels/web/notifications",
						},
					],
				},
				{
					id: "punto-de-venta",
					title: t("app.sidebar.salesChannels.pos.label"),
					url: "/app/channels/pos",
					icon: Store,
				},
			],
		},
	];
}
