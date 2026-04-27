import type { Locale } from '@/lib/i18n'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import styles from './ListingFAQ.module.css'

export function ListingFAQ({ locale }: { locale: Locale }) {
  const isEs = locale === 'es'
  const pricingHref = isEs
    ? '/es/precios-administracion-propiedades/'
    : '/property-management-pricing/'

  const items = [
    {
      question: isEs
        ? '¿Qué pasa si estoy con otro administrador de propiedades actualmente?'
        : "What if I'm currently with another property manager?",
      answer: isEs
        ? 'La mayoría de nuestros nuevos propietarios están cambiando. Envíanos tu contrato actual y revisaremos juntos el período de aviso y los términos de salida. Coordinamos la transferencia con tu administrador actual directamente — llaves, calendarios, códigos, contactos de proveedores, acceso a canales. Las reservas existentes se transfieren limpiamente sin impacto en los huéspedes. La mayoría de las transiciones se completan en 14-30 días dependiendo de tu contrato.'
        : "Most of our new owners are switching. Send us your existing contract and we'll review the notice period and exit terms together. We coordinate the handoff with your current manager directly — keys, calendars, codes, vendor contacts, channel access. Existing bookings transfer cleanly with zero impact on guests. Most transitions complete in 14-30 days depending on your contract.",
    },
    {
      question: isEs
        ? 'Actualmente administro mi propiedad yo mismo. ¿Por qué cambiar a PlayaStays?'
        : 'I currently manage my property myself. Why switch to PlayaStays?',
      answer: isEs
        ? 'Auto-administrar significa responder mensajes a todas horas, buscar limpiadores, manejar emergencias de mantenimiento y vigilar precios en cada canal. Hemos construido sistemas para todo eso. La mayoría de los propietarios que incorporamos desde la auto-administración recuperan aproximadamente 15-20 horas por semana y ven aumentos significativos de ingresos por la optimización profesional de precios. La economía funciona incluso después de nuestra comisión.'
        : "Self-managing means you're answering messages at all hours, scrambling for cleaners, fielding maintenance emergencies, and watching pricing on every channel. We've built systems for all of that. Most owners we onboard from self-management get back roughly 15-20 hours per week and see meaningful revenue lift from professional pricing optimization. The economics work even after our fee.",
    },
    {
      question: isEs
        ? 'Acabo de comprar una propiedad y aún no la he listado. ¿Pueden ayudarme a empezar desde cero?'
        : "I just bought a property and haven't listed yet. Can you help me start from zero?",
      answer: isEs
        ? 'Sí — esta es una de nuestras especialidades. Nos encargamos de la fotografía, escribimos tu listado, establecemos los precios iniciales basados en datos reales del mercado para tu área específica, te registramos en Airbnb/VRBO/Booking.com, y te tenemos en vivo dentro de 7 días de la firma del contrato. Los propietarios primerizos suelen tener meses de apertura fuertes porque ponemos precios agresivos para las reseñas tempranas.'
        : "Yes — this is one of our specialties. We'll handle photography, write your listing, set initial pricing based on real market data for your specific area, register you on Airbnb/VRBO/Booking.com, and have you live within 7 days of contract signing. First-time owners often see strong opening months because we price aggressively for early reviews.",
    },
    {
      question: isEs ? '¿Cuánto cuesta PlayaStays?' : 'What does PlayaStays cost?',
      answer: isEs
        ? `Dos componentes: una tarifa fija de $125/mes por Property Care (inspecciones, servicios, correo, coordinación de proveedores, línea de emergencia 24/7) y 10% sobre ingresos de arrendamiento a largo plazo O 15% sobre ingresos de renta a corto plazo dependiendo de tu situación. Sin cargos de configuración, sin sorpresas. Ve el desglose completo en nuestra <a href="${pricingHref}">página de precios</a>.`
        : `Two components: a flat $125/month for Property Care (inspections, utilities, mail, vendor coordination, 24/7 emergency line) and either 10% on long-term lease income OR 15% on short-term rental income depending on your situation. No setup fees, no surprise charges. See the full breakdown on our <a href="${pricingHref}">pricing page</a>.`,
    },
    {
      question: isEs ? '¿Qué tan rápido puedo estar generando ingresos?' : 'How fast can I be earning?',
      answer: isEs
        ? 'Para nuevos listados: en vivo en Airbnb, VRBO y Booking.com en 7 días de la firma del contrato. Para cambios: depende del período de aviso de tu contrato actual, típicamente 14-30 días. Podemos darte un cronograma específico una vez que envíes el formulario.'
        : "For new listings: live on Airbnb, VRBO, and Booking.com within 7 days of contract signing. For switches: depends on your current contract's notice period, typically 14-30 days. We can give you a specific timeline once you submit the form.",
    },
    {
      question: isEs ? '¿Cómo voy a saber qué pasa con mi propiedad?' : "How will I know what's happening with my property?",
      answer: isEs
        ? 'Tienes un portal de propietario que muestra reservas en vivo, ingresos, gastos, solicitudes de mantenimiento y reseñas de huéspedes — actualizado en tiempo real. Reportes mensuales resumen el rendimiento y los depósitos netos. Además, puedes mandar WhatsApp o email a Chris directamente cuando quieras.'
        : "You get an owner portal showing live bookings, revenue, expenses, maintenance requests, and guest reviews — updated in real time. Monthly reports summarize performance and net deposits. Plus, you can WhatsApp or email Chris directly anytime.",
    },
    {
      question: isEs ? '¿Administran propiedades en mi ciudad?' : 'Do you manage properties in my city?',
      answer: isEs
        ? 'Operamos en 8 ciudades de Quintana Roo: Playa del Carmen, Tulum, Akumal, Puerto Morelos, Xpu-Ha, Chetumal, Isla Mujeres y Cozumel. Oficinas verificadas en Playa del Carmen, Tulum y Cozumel. Si tu ciudad está en esta lista, tenemos operaciones en sitio allí.'
        : 'We operate across 8 cities in Quintana Roo: Playa del Carmen, Tulum, Akumal, Puerto Morelos, Xpu-Ha, Chetumal, Isla Mujeres, and Cozumel. Verified offices in Playa del Carmen, Tulum, and Cozumel. If your city is on this list, we have on-the-ground operations there.',
    },
  ]

  return (
    <section className={`pad-lg bg-white ${styles.section}`}>
      <div className={`container ${styles.wrap}`}>
        <FaqAccordion
          eyebrow={isEs ? 'LOS PROPIETARIOS PREGUNTAN' : 'OWNERS OFTEN ASK'}
          headline={isEs ? 'Preguntas comunes antes de listar.' : 'Common questions before listing.'}
          items={items}
          twoColumn
          initialOpenIndex={null}
        />
      </div>
    </section>
  )
}
