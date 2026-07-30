import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, n as Slot, t as Label$1 } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Mail, c as ArrowUpRight, i as Menu, l as ArrowRight, n as Twitter, o as Linkedin, r as Send, s as Github, t as X, u as ArrowDown } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ei7KCLyi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-surface-raised text-fg border border-border hover:border-border-strong hover:bg-surface",
			ghost: "text-muted hover:text-fg hover:bg-surface-raised",
			outline: "border border-border bg-transparent text-fg hover:border-accent/50 hover:text-accent",
			link: "text-accent underline-offset-4 hover:underline p-0 h-auto"
		},
		size: {
			default: "h-11 px-5 py-2",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-md px-7 text-base",
			icon: "h-11 w-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var links = [
	{
		href: "#about",
		label: "About"
	},
	{
		href: "#skills",
		label: "Skills"
	},
	{
		href: "#projects",
		label: "Projects"
	},
	{
		href: "#contact",
		label: "Contact"
	}
];
function Nav() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		if (open) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("fixed inset-x-0 top-0 z-50 transition-all duration-250", scrolled ? "border-b border-border/80 bg-bg/85 backdrop-blur-md" : "bg-transparent"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-narrow section-pad flex h-16 items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#top",
					className: "text-sm font-semibold tracking-tight text-fg transition-colors hover:text-accent",
					children: "Muhamad Abduh"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 md:flex",
					"aria-label": "Primary",
					children: [links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						className: "rounded-md px-3.5 py-2 text-sm text-muted transition-colors duration-150 hover:text-fg",
						children: link.label
					}, link.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "ml-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#contact",
							children: "Get in touch"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "md:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					"aria-expanded": open,
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-bg/95 backdrop-blur-md md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "container-narrow section-pad flex flex-col gap-1 py-4",
				"aria-label": "Mobile",
				children: [links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: link.href,
					onClick: () => setOpen(false),
					className: "rounded-md px-3 py-3 text-base text-muted transition-colors hover:bg-surface hover:text-fg",
					children: link.label
				}, link.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-2 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#contact",
						onClick: () => setOpen(false),
						children: "Get in touch"
					})
				})]
			})
		})]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "section-pad relative flex min-h-[100svh] items-center pb-20 pt-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 overflow-hidden",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-32 top-24 h-72 w-72 rounded-full bg-accent/8 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-accent-soft/20 blur-3xl" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-narrow relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "order-2 lg:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "fade-up mb-4 text-sm font-medium tracking-wide text-accent",
						children: "Educator · Engineer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "fade-up stagger-1 text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl",
						children: "Muhamad Abduh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "fade-up stagger-2 mt-5 max-w-xl text-lg text-muted leading-relaxed",
						children: "Building clear systems and helping people grow through education and engineering — with craft, curiosity, and care."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fade-up stagger-3 mt-8 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#projects",
								children: ["View projects", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#contact",
								children: "Contact me"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#about",
						className: "fade-up stagger-4 mt-14 inline-flex items-center gap-2 text-sm text-subtle transition-colors hover:text-muted",
						children: ["Scroll to explore", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3.5 w-3.5" })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "order-1 flex justify-center lg:order-2 lg:justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fade-up stagger-2 relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -inset-3 rounded-[1.75rem] border border-border/60",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-xl border border-border bg-surface shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/portrait.jpg",
							alt: "Portrait of Muhamad Abduh",
							width: 420,
							height: 520,
							className: "aspect-[4/5] w-64 object-cover object-top sm:w-72 lg:w-80"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0 bg-linear-to-t from-bg/40 via-transparent to-transparent",
							"aria-hidden": true
						})]
					})]
				})
			})]
		})]
	});
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "about",
		className: "section-pad border-t border-border py-24 sm:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-narrow",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-wide text-accent",
					children: "About"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
					children: "Bridging learning and building"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 text-base leading-relaxed text-muted sm:text-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "I am an educator and engineer who thrives at the intersection of teaching and technology. My work is about making complex ideas approachable — whether that means designing a curriculum, mentoring a team, or shipping software that people actually enjoy using." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Over the years I have led classrooms, workshops, and engineering projects with the same mindset: start from the learner's or user's needs, iterate with feedback, and keep the craft high. I care about clarity in documentation, thoughtful system design, and creating spaces where people feel safe to ask questions." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "When I am not teaching or coding, you will find me exploring new tools, writing notes on what I learn, and collaborating with people who share a passion for education and well-built products." })
					]
				})]
			})
		})
	});
}
var skillGroups = [
	{
		title: "Education",
		skills: [
			"Curriculum Design",
			"Instructional Design",
			"Mentorship",
			"Workshop Facilitation",
			"Technical Writing",
			"Assessment Design"
		]
	},
	{
		title: "Engineering",
		skills: [
			"JavaScript / TypeScript",
			"React",
			"Node.js",
			"Python",
			"System Design",
			"API Design",
			"Git & CI/CD",
			"Cloud Basics"
		]
	},
	{
		title: "Practice",
		skills: [
			"Agile Collaboration",
			"Product Thinking",
			"Documentation",
			"Public Speaking",
			"Cross-functional Leadership"
		]
	}
];
function Skills() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "skills",
		className: "section-pad border-t border-border py-24 sm:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-narrow",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium tracking-wide text-accent",
						children: "Skills"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
						children: "Competencies I bring to the table"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted leading-relaxed",
						children: "A balanced mix of teaching craft and engineering depth — ready for classrooms, product teams, and everything in between."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
				children: skillGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-6 sm:p-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold uppercase tracking-wider text-subtle",
						children: group.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 flex flex-wrap gap-2",
						children: group.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-sm text-fg transition-colors duration-150 hover:border-accent/40 hover:text-accent",
							children: skill
						}) }, skill))
					})]
				}, group.title))
			})]
		})
	});
}
var projects = [
	{
		title: "LearnPath Studio",
		description: "A modular learning platform that helps educators design structured courses with interactive exercises, progress tracking, and lightweight assessments.",
		tags: [
			"EdTech",
			"React",
			"Curriculum"
		],
		href: "#"
	},
	{
		title: "Signal Desk",
		description: "An internal engineering dashboard for monitoring service health, deployment status, and team on-call rotations — built for clarity under pressure.",
		tags: [
			"Dashboard",
			"TypeScript",
			"Ops"
		],
		href: "#"
	},
	{
		title: "MentorMatch",
		description: "A matching tool that connects early-career engineers with mentors based on goals, skills, and availability, with guided session agendas.",
		tags: [
			"Community",
			"Product",
			"UX"
		],
		href: "#"
	}
];
function Projects() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "projects",
		className: "section-pad border-t border-border py-24 sm:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-narrow",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tracking-wide text-accent",
							children: "Projects"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
							children: "Selected work"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted leading-relaxed",
							children: "A few highlights that reflect how I think about education, systems, and product craft."
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: projects.map((project, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-border-strong sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tabular-nums text-subtle",
								children: String(i + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: project.href,
								className: "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors duration-150 group-hover:border-accent/40 group-hover:text-accent",
								"aria-label": `Open ${project.title}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-semibold tracking-tight text-fg",
							children: project.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 flex-1 text-sm leading-relaxed text-muted",
							children: project.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: project.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-surface-raised px-2.5 py-1 text-xs text-subtle",
								children: tag
							}, tag))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "mt-5 w-fit px-0 text-accent hover:bg-transparent hover:text-accent/80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: project.href,
								children: ["View project", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
							})
						})
					]
				}, project.title))
			})]
		})
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-border bg-surface px-3.5 py-2 text-sm text-fg placeholder:text-subtle transition-colors duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-accent/40", "disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-32 w-full rounded-md border border-border bg-surface px-3.5 py-3 text-sm text-fg placeholder:text-subtle transition-colors duration-150 resize-y", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-accent/40", "disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn("text-sm font-medium text-fg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
	...props
}));
Label.displayName = Label$1.displayName;
var socials = [
	{
		label: "Email",
		href: "mailto:hello@muhamadabduh.dev",
		icon: Mail,
		value: "hello@muhamadabduh.dev"
	},
	{
		label: "LinkedIn",
		href: "https://linkedin.com",
		icon: Linkedin,
		value: "linkedin.com/in/muhamadabduh"
	},
	{
		label: "GitHub",
		href: "https://github.com",
		icon: Github,
		value: "github.com/muhamadabduh"
	},
	{
		label: "X / Twitter",
		href: "https://x.com",
		icon: Twitter,
		value: "@muhamadabduh"
	}
];
function Contact() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	function onSubmit(e) {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !message.trim()) {
			toast.error("Please fill in all fields.");
			return;
		}
		setSending(true);
		window.setTimeout(() => {
			setSending(false);
			setName("");
			setEmail("");
			setMessage("");
			toast.success("Message sent — thank you! I’ll get back to you soon.");
		}, 700);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "section-pad border-t border-border py-24 sm:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-narrow",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium tracking-wide text-accent",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
						children: "Let’s work together"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted leading-relaxed",
						children: "Open to teaching collaborations, engineering projects, and thoughtful conversations. Drop a note — I usually reply within a few days."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: socials.map((item) => {
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: item.href,
							target: item.href.startsWith("http") ? "_blank" : void 0,
							rel: item.href.startsWith("http") ? "noopener noreferrer" : void 0,
							className: "group flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-4 transition-colors duration-150 hover:border-border-strong",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-raised text-muted transition-colors group-hover:text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-medium uppercase tracking-wider text-subtle",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm text-fg",
									children: item.value
								})]
							})]
						}, item.label);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit,
					className: "rounded-xl border border-border bg-surface p-6 sm:p-8",
					noValidate: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									name: "name",
									autoComplete: "name",
									placeholder: "Your name",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									name: "email",
									type: "email",
									autoComplete: "email",
									placeholder: "you@example.com",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "message",
									children: "Message"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "message",
									name: "message",
									placeholder: "Tell me about your project or idea...",
									value: message,
									onChange: (e) => setMessage(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "lg",
								className: "w-full sm:w-auto",
								disabled: sending,
								children: [sending ? "Sending..." : "Send message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })]
							})
						]
					})
				})]
			})]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "section-pad border-t border-border py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-narrow flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-subtle",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Muhamad Abduh. All rights reserved."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#top",
				className: "text-sm text-muted transition-colors hover:text-accent",
				children: "Back to top"
			})]
		})
	});
}
function PortfolioPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skills, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projects, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { PortfolioPage as component };
