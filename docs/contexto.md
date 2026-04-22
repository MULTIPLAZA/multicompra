# Contexto original

Fecha: 2026-04-22
Fuente: `Desktop/multitech.txt`

---

Quiero desarrollar una PWA, que se use desde cualquier notebook o pc, para pedidos de órdenes de compra. Tengo un sistema de gestión de stock que es el sistema base que ya está en producción. Mi intención es desarrollar la app para gestionar las órdenes de compra como una app satélite. El espíritu del proyecto es darle a nuestros clientes una herramienta para mejorar sus decisiones en la reposición de las mercaderías de su negocio:

> Diego, su problema fundamental es que las chicas de los locales realizan pedidos de reposición sin criterio alguno e irresponsablemente, porque no tiene consecuencias. Por ejemplo si tienen un producto CASE iPhone 17 pro max, tienen 5 unidades, piden 20 unidades para reposición, pero solo por obligación porque algo tienen que hacer. Entonces el problema es que se llena de mercaderías inútiles que probablemente no se venda y probablemente tenga que desechar, generándole un costo enormemente innecesario. El propietario ya intentó de muchas formas estructurar este mecanismo, pero sin mucho éxito en el seguimiento. Por eso estamos replanteando una app para resolver este problema, en esta plataforma. Observación: el propietario cuenta con 10 locales de venta de accesorios de celulares, y un depósito central.

## Fase 1 — Integración con API

Para acceder a la base de datos de producción el proveedor nos provee una API a la que hay que enviarle una query que siempre ejecuta el mismo SP (SQL Server), y dependiendo de la query el API retornará el valor que necesitás. Ejemplo: `exec SPMultiCompra @Accion='PRODUCTOS'` devuelve la lista de productos detallado (IDProducto, CódigoBarra, Descripción, Costo, Precio, etc.). Cualquier info que requieras, se solicita en `@Accion` y la BD de producción la devuelve.

## Fase 2 — MVP

Los empleados, en un día específico, tienen la tarea de realizar sus órdenes de pedido (OP) con criterio externo (protocolo fuera del software). Todas esas OPs quedan pendientes de OC. Un supervisor con perfil especial genera la OC eligiendo las OPs pendientes.

En el detalle de la OC se registran y agrupan todas las OPs que la conforman. El rol del supervisor es decidir qué y cuántos productos se confirman para la OC. Por eso el supervisor tiene opción de edición de planilla de OC. **No se edita lo que se pidió sino lo que se va a pedir.** Lo que se pidió se tiene que reportar.

Para facilitar al supervisor, solamente edita lo que no se va a comprar o lo que se va a cambiar de cantidad. No es necesario que el supervisor confirme uno a uno.

El supervisor tiene la opción y visualización del **stock actual del depósito central** (actualizable en cualquier momento vía API). Entre el tiempo del pedido, la OC y la compra puede pasar mucho tiempo y el stock moverse. ¿Por qué el supervisor necesita ver el depósito central? Porque puede decidir reponer la mercadería desde central sin necesidad de comprar — ese es su trabajo.

La planilla de OC debe tener 3 campos relevantes: **Cantidad Pedida, Cantidad a Comprar, Cantidad Comprada**.

Una vez que la OC esté definida, el supervisor procesa el cierre: todas las OPs quedan cerradas, la OC queda cerrada, y se permite generar PDF o Excel. Se puede enviar por WhatsApp o descargar.

## Fase 3 — Compra física

Se realiza la compra física y el documento papel se carga en la plataforma MultiCompra. La carga debe tener la info de la factura: fecha, RUC del proveedor, nombre, número de comprobante, etc. Además tiene que tener la funcionalidad de precarga de la OC generada (la compra va anexada a una OC).

El trabajo del supervisor va a ser, una vez que reciba la compra, verificar si todo lo que los proveedores le mandaron coincide con la OC. La compra precarga toda la OC y se revisan solo las diferencias, y si coincide los montos de compra y OC. Una vez verificada, se actualiza la API (esto mueve el stock en el sistema base).

---

## Pedido del usuario (mismo mensaje)

> Ayudame a crear sub-agentes que me asesoren con el diseño del producto en sí del software, diseño del proceso, diseño de la interfaz, etc, y que conversemos y plan(t)emos todo. Una vez cerrado ahí recién empezaremos a maquetar y a desarrollar. Guardá en memoria el contexto de este proyecto, podés crear un repositorio local en github para ir construyendo todo.
