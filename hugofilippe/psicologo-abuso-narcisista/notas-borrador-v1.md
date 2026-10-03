# Landing `/psicologo-abuso-narcisista/`: notas del borrador v1

Fecha: 03/10/2026. Estado: borrador para revisión humana; sin publicar en WordPress.
Archivo de contenido: `landing-borrador-v1.html` (markup Gutenberg).

## 1. Decisiones aplicadas

| Tema | Decisión | Origen |
|---|---|---|
| Foco | La landing trabaja la intención de contratar terapia online para el abuso narcisista; `/abuso-narcisista/` se queda con la intención informativa | Acordado con el terapeuta, 02/10/2026 |
| «Especialista» y «experto» | Se retiran como atributos propios. La palabra aparece una sola vez, en la pregunta frecuente «¿Qué especialista trata el abuso narcisista?», con sentido informativo | Art. 51 del Código Deontológico del Psicólogo y RD 183/2008 (fuentes secundarias); **pendiente de confirmar con el Colegio** |
| Credencial | «Formación certificada como Clínico en Tratamiento del Abuso Narcisista (NATC, Certified Narcissistic Abuse Treatment Clinician)», sin año | Indicación del terapeuta; sigla tomada de PESI |
| Años de experiencia | «En consulta desde 2013», en lugar del contador «+13 años» | Indicación del terapeuta; coincide con `foundingDate` del schema |
| Llamada de 15 minutos | Eliminada. Las dos vías son reservar en TidyCal o escribir por WhatsApp | Indicación del terapeuta |
| Precio de la primera entrevista | El mismo que una sesión, visible antes del calendario y en la FAQ | Indicación del terapeuta; **falta la cifra** |
| Latinoamérica | Se atiende; el precio en euros se muestra antes del WhatsApp y en una pregunta frecuente para filtrar las consultas que no pueden asumirlo | Indicación del terapeuta |
| Rasgos narcisistas | Se atiende en un servicio aparte; aquí solo una pregunta frecuente que remitirá a esa futura landing | Indicación del terapeuta |
| Opiniones | Se eliminan las estrellas fijas («5/5» frente a 4,9) y se usa el widget de Trustindex en `#opiniones` | Indicación del terapeuta |

## 2. Competencia (SERP del 02/10 y 03/10/2026, SerpApi, Google España)

Las páginas competidoras no se han podido leer completas, porque el proxy de este entorno bloquea sus dominios. El análisis se basa en títulos y fragmentos de la SERP.

| Consulta | Quién ocupa el top 10 | Lectura |
|---|---|---|
| psicólogo abuso narcisista (escritorio, páginas 1 y 2) | Doctoralia y Top Doctors por ciudad, Instagram, YouTube, Facebook, Quora, un curso, `ayudapsicologica.online` (posición 9) | hugofilippe.com fuera del top 20 en escritorio; dominan los directorios locales |
| terapia abuso narcisista (escritorio) | Top Doctors, Mayo Clinic, YouTube, `mariaflorenciaariaspsicologa.es` (6), `fannymasjordana.es` «Terapia Abuso Narcisista Online» (7) | Las landings individuales que rankean usan «terapia» y «online» |
| especialista en narcisismo (móvil) | Doctoralia y Top Doctors por ciudad, itersia.com (Barcelona), grupotelos.es (Madrid), mariaaguadopsicologa.com, anaocana.com | Mezcla de víctimas y de trastorno narcisista; hugofilippe.com fuera del top 10 en esta captura |
| terapia abuso narcisista online (móvil) | TikTok, Facebook, Instagram, cursos, Doctoralia, Terapify | La SERP está poco consolidada: hay hueco para una landing online sólida |
| psicólogo abuso narcisista online precio sesión | Top Doctors, Núria León (sesiones de 55 min), Karuna (60 € por sesión), Mandala (20 €, tarifa reducida) | Referencias de precio de mercado tomadas de los fragmentos, sin verificar en las páginas |

Preguntas de «Otras preguntas de los usuarios» cubiertas en el borrador:
- ¿Qué tipo de terapia se recomienda para las víctimas de abuso narcisista? → sección 3.
- ¿Cómo se puede sanar o recuperarse del abuso narcisista? → secciones 3 y 4.
- ¿Qué especialista puede tratar a un narcisista? → pregunta frecuente 5.
- ¿Qué tipo de trauma se produce por el abuso narcisista? → secuelas en la pregunta frecuente 2. Puede ampliarse.

El resumen de IA de Google para «psicólogo abuso narcisista» se organiza en «por qué buscar ayuda especializada», «preguntas para elegir al profesional» y «qué esperar de las primeras sesiones». La sección 5 y la pregunta frecuente 5 responden a esos bloques.

## 3. Datos que respaldan el borrador

| Dato | Valor | Fuente |
|---|---|---|
| Rendimiento de la landing | 63 clics, 2.875 impresiones, CTR 2,19 %, posición 11,38 | Search Console filtrado por URL, 30/06 a 29/09/2026 |
| «especialista en narcisismo» | 826 impresiones, posición 11,54, 0 clics | ídem |
| Consultas con «especialista» | 1.036 de 1.661 impresiones desglosadas (62 %) | ídem |
| Escritorio | 1.323 impresiones, 1 clic, CTR 0,08 % | ídem |
| Impresiones por país | Latinoamérica 1.034 frente a España 586 (España en posición 17,28) | ídem |
| Visitas a la landing | 54 páginas vistas, 59 % en móvil, 30 % con scroll de 25 % o menos | Simple Analytics, 31/08 a 30/09/2026 |
| Enlaces internos hacia la landing | 14 desde `/mujer-narcisista/`; 0 desde otros seis artículos con entre 70 y 170 páginas vistas | ídem |

## 4. Cambios fuera del markup (aplicar en WordPress)

**Plugin SEO**
- Meta title (51 caracteres): `Psicólogo para el abuso narcisista | Terapia online`
- Meta description (156 caracteres): `Psicólogo sanitario con formación certificada en el tratamiento del abuso narcisista. Terapia online para entender lo vivido y recuperar tu propio criterio.`
- En el schema `WebPage`, cambiar `name` de «Psicólogo online especialista en abuso narcisista» a un texto sin «especialista».

**Spectra / FAQ**
- Al pegar el bloque FAQ, comprobar que el schema `FAQPage` publicado ya no lleva `<strong>` dentro de `name`; la versión actual sí lo lleva.
- Si Gutenberg marca el bloque FAQ como no válido, usar «Intentar recuperar el bloque». Los `block_id` nuevos se generaron a mano.

**Diseño**
- El borrador usa bloques core sin fondos ni colores. Hay que reaplicar el estilo del sitio, o bien copiar los textos dentro de los contenedores UAGB actuales.
- Sin animaciones UAGB ni `background-attachment: fixed`. Si se reutilizan contenedores UAGB, desactivar ambas cosas.
- Botón de WhatsApp: si se mantiene el verde `#25d366`, poner el texto en `#000000` para cumplir el contraste AA. Los botones del borrador usan el estilo del tema y su contraste está por revisar.
- Reinsertar el retrato desde la biblioteca de medios para que WordPress añada `width`, `height` y `srcset`.
- Comprobar que Astra no muestra el título de la página como un segundo H1.

**Pie de página global**
- El H5 «Guías más buscadas 2025» está desactualizado. Afecta a todo el sitio.

**Medición** (requiere permiso, porque toca la configuración global)
- Activar los eventos automáticos de Simple Analytics para los clics en WhatsApp.
- Configurar en TidyCal una redirección tras la reserva a una página de agradecimiento sin indexar. Falta comprobar que tu plan lo permite.

**Enlaces desde el blog** (requiere permiso, porque toca varias páginas)
- Añadir enlaces contextuales a la landing desde `/hombre-narcisista-sexualidad/`, `/test-de-narcisismo/`, `/madre-narcisista/`, `/como-termina-una-mujer-narcisista/`, `/narcisista-encubierto/` y `/como-castigan-los-narcisistas/`.

## 5. Marcadores pendientes en el borrador

- [ ] `[PRECIO]`: precio de la sesión en euros. Aparece 3 veces.
- [ ] `[DURACIÓN]`: duración en minutos. Aparece 3 veces.
- [ ] `[CANCELACIÓN]`: política de cancelación y cambio de cita. Aparece 2 veces.
- [ ] `[ENLACE LANDING RASGOS NARCISISTAS]`: cuando exista esa landing; si no, eliminar la frase.
- [ ] Sigla NATC: comprobarla en tu certificado. Tú escribiste «NACTC» y la fuente consultada (PESI) usa «NATC».
- [ ] «sin compromiso de continuar» en la sección 5: confirmar que es tu condición real.

## 6. Revisión humana obligatoria

- **Clínica:**
  - el párrafo sobre el DSM-5 y el diagnóstico a distancia (sección 2);
  - la frase sobre la relación terapéutica (sección 3);
  - las secuelas (pregunta frecuente 2).
- **Legal y deontológica:**
  - redacción de la credencial y de la pregunta frecuente «¿Qué especialista…?»;
  - uso de testimonios de pacientes, que además citan tu nombre;
  - «colegiado en Madrid» sin número, según la regla del repositorio.
- **Testimonios:** solo se han corregido «..» y «dió»; el resto del texto queda literal.

## 7. Lista de comprobación

- [ ] Cada cifra con fuente y fecha: sí en estas notas; el precio sigue pendiente.
- [x] Un solo H1 con la keyword principal; keyword en las primeras 100 palabras, en un H2 y en la meta description.
- [x] Ningún `href="#"` vacío; enlaces internos con slugs vistos en Search Console y Simple Analytics, pendientes de comprobar que responden con un 200.
- [ ] Precio y oferta coherentes: estructura coherente, falta la cifra.
- [ ] Revisión a 360 y 375 px: pendiente; requiere maquetar en WordPress.
- [x] Alt text en la única imagen del borrador.
- [x] Voz: sin raya larga, sin negación enfática, sin «Quiero + servicio» y sin urgencia («ahora» eliminado).
- [x] Nivel de confianza indicado.

## 8. Nivel de confianza

- **Alta** en la estructura y en los datos citados.
- **Media** en el análisis de la competencia, porque se basa solo en fragmentos de la SERP.
- **Media-alta** en el criterio legal sobre «especialista», pendiente de confirmar con el Colegio.
