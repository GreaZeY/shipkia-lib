# Frontend Runtime Platform — Full Low Level Design (LLD)

# 1. Core Philosophy

The frontend is NOT:

```txt id="f1"
Pages + Components + API Calls
```

The frontend IS:

```txt id="f2"
Composable Business Runtime Platform
```

The frontend behaves like:

* operating system
* workflow engine
* metadata runtime
* reactive graph processor
* extension platform
* business orchestration runtime

UI is only a projection layer.

---

# 2. Primary Goals

The frontend runtime must support building:

* CRM
* Ecommerce
* ERP
* Shipping
* HRMS
* Inventory
* Accounting
* Ticketing
* CMS
* Admin Panels
* SaaS Products
* Internal Tools

WITHOUT rewriting infrastructure repeatedly.

---

# 3. Core Runtime Principles

# Principle 1

```txt id="f3"
Runtime exists before UI
```

---

# Principle 2

```txt id="f4"
Everything important is metadata-driven
```

---

# Principle 3

```txt id="f5"
Business logic never lives in components
```

---

# Principle 4

```txt id="f6"
Everything extensible registers through registries
```

---

# Principle 5

```txt id="f7"
All runtime updates are transactional
```

---

# Principle 6

```txt id="f8"
UI only projects runtime state
```

---

# Principle 7

```txt id="f9"
Layout never controls runtime execution
```

---

# Principle 8

```txt id="f10"
Developers define defaults
Users personalize behavior
```

---

# 4. Runtime Architecture Overview

```txt id="f11"
                    APPLICATION MODULES
                              ↓
                       METADATA DEFINITIONS
                              ↓
                        METADATA COMPILER
                              ↓
                        REGISTRY SYSTEM
                              ↓
                      RUNTIME ORCHESTRATORS
                              ↓
                   TRANSACTION + EVENT SYSTEM
                              ↓
                        STATE PARTITIONS
                              ↓
                       RENDERING ADAPTERS
                              ↓
                           UI LAYER
```

---

# 5. Runtime Layers

```txt id="f12"
Shell Runtime
  ↓
Dependency Injection Runtime
  ↓
Module Runtime
  ↓
Metadata Runtime
  ↓
Registry Runtime
  ↓
Permission Runtime
  ↓
Extension Runtime
  ↓
Query Runtime
  ↓
Workflow Runtime
  ↓
Reactive Runtime
  ↓
Renderer Runtime
  ↓
Projection Components
```

---

# 6. Infrastructure Libraries

# Philosophy

Do NOT reinvent infrastructure already solved properly.

Wrap mature systems.

Own orchestration/runtime.

---

# Approved Infrastructure

| Concern       | Library          |
| ------------- | ---------------- |
| Forms         | React Hook Form  |
| Queries       | TanStack Query   |
| Tables        | TanStack Table   |
| Routing       | React Router     |
| Validation    | Zod              |
| Accessibility | Radix UI         |
| Drag Drop     | dnd-kit          |
| Charts        | ECharts/Recharts |
| Editors       | Monaco/Tiptap    |

---

# Rules

Applications NEVER consume infrastructure libraries directly.

Everything goes through runtime adapters.

---

# 7. Dependency Injection Runtime

# Purpose

All runtime systems resolve dependencies through container runtime.

Never import runtime singletons directly.

---

# Runtime Architecture

```txt id="f13"
Container Runtime
  ↓
Service Registration
  ↓
Dependency Resolution
  ↓
Lifecycle Management
```

---

# Service Registration

```ts id="f14"
container.register({
  id: 'queryRuntime',
  service: QueryRuntime
})
```

---

# Service Resolution

```ts id="f15"
const queryRuntime =
  container.resolve('queryRuntime')
```

---

# Benefits

* testability
* lazy loading
* runtime replacement
* plugin injection
* tenant overrides
* isolation

---

# 8. Module Runtime

# Philosophy

Applications are composed from modules.

Modules contribute runtime capabilities.

---

# Example Modules

```txt id="f16"
crm
shipping
inventory
hrms
billing
support
```

---

# Module Definition

```ts id="f17"
{
  id: 'crm',

  routes: [],
  entities: [],
  permissions: [],
  workflows: [],
  widgets: [],
  commands: [],
  navigation: [],
  slots: [],
  extensions: []
}
```

---

# Module Boot Flow

```txt id="f18"
module discovered
  ↓
manifest loaded
  ↓
dependencies resolved
  ↓
registries updated
  ↓
metadata compiled
  ↓
runtime indexes generated
  ↓
extensions resolved
```

---

# 9. Metadata Runtime

# Philosophy

Business systems are metadata-driven.

Metadata defines:

* entities
* forms
* lists
* dashboards
* workflows
* permissions
* actions
* layouts
* commands

---

# Metadata Rules

Metadata must remain:

* serializable
* portable
* framework independent
* deterministic

---

# NEVER ALLOW

```txt id="f19"
functions
closures
React components
JSX
runtime instances
```

inside metadata.

---

# Metadata Example

```ts id="f20"
{
  entity: 'crm.customer',

  fields: [],

  permissions: [],

  workflows: [],

  listViews: []
}
```

---

# 10. Metadata Compiler

# Responsibilities

```txt id="f21"
normalize metadata
  ↓
validate schemas
  ↓
resolve references
  ↓
build dependency graphs
  ↓
compile expressions
  ↓
generate execution indexes
  ↓
generate runtime registries
```

---

# Compiler Output

```ts id="f22"
{
  routeRegistry,
  entityRegistry,
  workflowRegistry,
  permissionRegistry,
  slotRegistry,
  queryIndexes,
  dependencyGraphs,
  compiledExpressions
}
```

---

# 11. Registry Runtime

# Philosophy

Everything extensible registers through registries.

---

# Registry Types

```txt id="f23"
routes
fields
filters
layouts
commands
actions
widgets
permissions
renderers
extensions
```

---

# Registry Lifecycle

```txt id="f24"
register
  ↓
validate
  ↓
index
  ↓
freeze contracts
```

---

# Registry Example

```ts id="f25"
runtime.fields.register({
  type: 'currency',
  renderer: CurrencyField
})
```

---

# NEVER

```txt id="f26"
push directly into runtime arrays
```

---

# 12. Extension Runtime

# Philosophy

Extensions modify runtime behavior safely.

---

# Extension Types

```txt id="f27"
toolbar actions
bulk actions
field contributions
navigation items
dashboard widgets
query extensions
workflow actions
render overrides
```

---

# Extension Resolution Flow

```txt id="f28"
framework defaults
  ↓
module defaults
  ↓
tenant overrides
  ↓
runtime extensions
  ↓
user personalization
  ↓
resolved runtime projection
```

---

# Extension Structure

```ts id="f29"
{
  target: 'crm.customer.list.toolbar',

  component: CustomerExportButton,

  priority: 100
}
```

---

# 13. Slot Runtime

# Philosophy

Slots are stable runtime extension contracts.

---

# Example Slots

```txt id="f30"
crm.customer.list.toolbar
crm.customer.details.sidebar
inventory.product.form.footer
```

---

# Slot Resolution Flow

```txt id="f31"
slot requested
  ↓
registry lookup
  ↓
permission filtering
  ↓
priority sorting
  ↓
dependency validation
  ↓
projection rendering
```

---

# 14. Routing Runtime

# Responsibilities

* route matching
* layout resolution
* permission gating
* preload orchestration
* extension injection
* transition lifecycle

---

# Route Definition

```ts id="f32"
{
  path: '/customers',

  layout: 'workspace',

  permissions: [],

  preload: [],

  metadata: {}
}
```

---

# Route Lifecycle

```txt id="f33"
route requested
  ↓
route matched
  ↓
permission runtime
  ↓
layout resolved
  ↓
metadata loaded
  ↓
queries preloaded
  ↓
extensions resolved
  ↓
render transaction
```

---

# Internal State

```ts id="f34"
{
  activeRoute,
  pendingRoute,
  preloadState,
  transitionState
}
```

---

# 15. Layout Runtime

# Responsibilities

* workspace layouts
* dockable panels
* sidebar orchestration
* responsive regions
* persisted layouts

---

# Layout Tree

```txt id="f35"
Layout
  ↓
Regions
  ↓
Slots
  ↓
Runtime Nodes
```

---

# Rules

Layout affects rendering only.

Never runtime execution.

---

# 16. Navigation Runtime

# Responsibilities

* menu generation
* permission filtering
* favorites
* recent pages
* tenant overrides
* personalization

---

# Navigation Resolution

```txt id="f36"
module navigation
  ↓
permission filtering
  ↓
tenant overrides
  ↓
user preferences
  ↓
resolved navigation tree
```

---

# 17. Permission Runtime (CASL-Inspired)

# Philosophy

Permissions are NOT role checks.

Permissions are:

```txt id="f37"
Capability Runtime System
```

UI never asks:

```txt id="f38"
isAdmin?
```

UI asks:

```txt id="f39"
Can user perform action in current runtime context?
```

---

# Permission Architecture

```txt id="f40"
Policies
  ↓
Ability Compiler
  ↓
Ability Graph
  ↓
Permission Evaluator
  ↓
Runtime Projection
```

---

# Permission Definition

```ts id="f41"
{
  action: 'update',

  subject: 'crm.customer',

  conditions: {
    ownerId: '$user.id'
  }
}
```

---

# Ability Runtime

```ts id="f42"
ability.can(
  'update',
  'crm.customer',
  entity
)
```

---

# Permission Layers

```txt id="f43"
framework permissions
  ↓
module permissions
  ↓
tenant permissions
  ↓
role permissions
  ↓
runtime conditions
```

---

# Field-Level Permissions

```ts id="f44"
{
  field: 'salary',

  read: ['hr.admin'],

  update: ['hr.manager']
}
```

---

# Permission Flow

```txt id="f45"
runtime request
  ↓
ability resolution
  ↓
condition evaluation
  ↓
runtime projection
```

---

# NEVER

```tsx id="f46"
user.role === 'admin'
```

inside components.

---

# 18. Query Runtime

# Philosophy

Centralized async orchestration runtime.

---

# Responsibilities

* caching
* invalidation
* optimistic updates
* subscriptions
* retries
* background sync
* realtime reconciliation

---

# Query Lifecycle

```txt id="f47"
query requested
  ↓
cache lookup
  ↓
fetch execution
  ↓
normalization
  ↓
cache update
  ↓
subscriber notification
```

---

# Mutation Flow

```txt id="f48"
mutation triggered
  ↓
optimistic patch
  ↓
subscriber update
  ↓
server execution
  ↓
reconciliation
  ↓
rollback on failure
```

---

# NEVER

```txt id="f49"
axios.get()
inside feature components
```

---

# 19. Realtime Runtime

# Philosophy

Realtime must remain transport-agnostic.

---

# Supported Transports

```txt id="f50"
websocket
SSE
polling
push events
```

---

# Realtime Flow

```txt id="f51"
event received
  ↓
event normalized
  ↓
entity resolved
  ↓
cache invalidated
  ↓
runtime patches generated
  ↓
subscriber updates
```

---

# 20. Command Bus

# Philosophy

Commands represent user intentions.

---

# Example Commands

```txt id="f52"
createCustomer
approveInvoice
cancelShipment
```

---

# Command Flow

```txt id="f53"
command dispatched
  ↓
permission validation
  ↓
workflow validation
  ↓
transaction creation
  ↓
mutation execution
  ↓
audit logging
  ↓
event emission
```

---

# 21. Event Bus

# Philosophy

Runtime systems communicate through events.

---

# Example Events

```txt id="f54"
routeChanged
entityUpdated
workflowCompleted
queryInvalidated
extensionRegistered
```

---

# Event Lifecycle

```txt id="f55"
event emitted
  ↓
scheduler queue
  ↓
runtime listeners
  ↓
patch generation
  ↓
transaction commit
```

---

# IMPORTANT

Events NEVER target UI directly.

---

# 22. Scheduler Runtime

# Philosophy

Never mutate synchronously.

Always queue work.

---

# Scheduler Flow

```txt id="f56"
event queued
  ↓
scheduler batch
  ↓
dependency resolution
  ↓
runtime execution
  ↓
patch aggregation
  ↓
transaction commit
```

---

# Scheduler Responsibilities

* batching
* prioritization
* async coordination
* render scheduling
* transaction ordering

---

# 23. Transaction Runtime

# Philosophy

All runtime updates are transactional.

---

# Transaction Flow

```txt id="f57"
BEGIN
  snapshot state
  evaluate runtime effects
  generate patches
  merge patches
COMMIT
```

---

# Benefits

* deterministic behavior
* rollback support
* replay support
* debugging
* conflict resolution

---

# 24. Reactive Form Runtime

# Philosophy

Fields are NOT components.

Fields are:

```txt id="f58"
Reactive Runtime Nodes
```

---

# Architecture

```txt id="f59"
Schema
  ↓
Compiler
  ↓
Dependency Graph
  ↓
Scheduler
  ↓
Runtime Engine
  ↓
Patch Generation
  ↓
Atomic Commit
  ↓
UI Projection
```

---

# Field Registry

```ts id="f60"
fields: {
  'billing.country': {},
  'billing.gst': {},
  'shipping.method': {}
}
```

---

# Why Flat Registry?

Any field may depend on any field.

---

# Field Runtime State

```ts id="f61"
{
  value,
  visible,
  disabled,
  loading,
  touched,
  dirty,
  errors,
  computed,
  dependencies
}
```

---

# Dependency Graph Example

```txt id="f62"
country
  ↓
tax
  ↓
shipping
  ↓
total
```

---

# Runtime Execution Flow

```txt id="f63"
fieldChanged(country)
  ↓
scheduler queue
  ↓
dependency graph traversal
  ↓
affected nodes resolved
  ↓
rules executed
  ↓
patch generation
  ↓
atomic commit
```

---

# Dynamic Visibility Example

```ts id="f64"
{
  when: {
    field: 'country',
    equals: 'IN'
  },

  then: [
    {
      action: 'show',
      target: 'gst'
    }
  ]
}
```

---

# Computed Fields

```ts id="f65"
{
  id: 'summary.total',

  compute: {
    expression: 'subtotal + tax',

    deps: [
      'subtotal',
      'tax'
    ]
  }
}
```

---

# Dynamic Option Runtime

```txt id="f66"
country changed
  ↓
async provider triggered
  ↓
versioned request
  ↓
response normalized
  ↓
options updated
```

---

# Async Validation Runtime

```txt id="f67"
field changed
  ↓
validation queued
  ↓
versioned request
  ↓
response returned
  ↓
stale check
  ↓
validation patches
```

---

# Rules

Field components NEVER:

* own business logic
* own dependency orchestration
* own permission logic
* own workflow logic

---

# 25. List Runtime

# Philosophy

List views are NOT tables.

They are:

```txt id="f68"
Business Operating Surfaces
```

---

# List Runtime Architecture

```txt id="f69"
Entity Runtime
  ↓
Query Runtime
  ↓
List Metadata
  ↓
Filter Runtime
  ↓
View Configurator Runtime
  ↓
Table Runtime
  ↓
Projection Renderer
```

---

# List Runtime Responsibilities

* filtering
* sorting
* grouping
* personalization
* realtime updates
* inline editing
* exports
* bulk operations
* saved views

---

# View Configurator Philosophy

Developers define defaults.

Users customize runtime behavior.

---

# User Configurable Features

```txt id="f70"
columns
sorting
filters
grouping
density
saved views
layouts
pinned columns
```

---

# View Resolution Order

```txt id="f71"
framework defaults
  ↓
module defaults
  ↓
tenant defaults
  ↓
role defaults
  ↓
user personalization
```

---

# List Extension Runtime

# Supported Extensions

```txt id="f72"
toolbar actions
row actions
bulk actions
custom columns
custom renderers
exports
query extensions
filter operators
```

---

# Bulk Action Flow

```txt id="f73"
selection updated
  ↓
permission validation
  ↓
workflow validation
  ↓
transaction queued
  ↓
mutation execution
  ↓
optimistic reconciliation
```

---

# Inline Editing Runtime

```txt id="f74"
cell edited
  ↓
validation runtime
  ↓
permission runtime
  ↓
transaction queued
  ↓
optimistic patch
  ↓
server sync
```

---

# 26. Dashboard Runtime

# Philosophy

Dashboards are modular runtime compositions.

---

# Dashboard Architecture

```txt id="f75"
Dashboard Metadata
  ↓
Widget Registry
  ↓
Layout Runtime
  ↓
Query Runtime
  ↓
Projection Renderer
```

---

# Dashboard Features

* drag/drop
* resizing
* realtime widgets
* personalization
* saved dashboards
* tenant dashboards

---

# Widget Registration

```ts id="f76"
runtime.widgets.register({
  id: 'sales-chart',
  component: SalesChartWidget
})
```

---

# 27. Workflow Runtime

# Philosophy

Frontend workflows orchestrate business processes.

---

# Workflow Flow

```txt id="f77"
workflow triggered
  ↓
context resolved
  ↓
condition evaluation
  ↓
action execution
  ↓
event emission
  ↓
audit logging
```

---

# Workflow Features

* approvals
* retries
* async orchestration
* automation
* scheduled actions

---

# 28. Renderer Runtime

# Philosophy

Renderer converts runtime state into UI projections.

---

# Renderer Flow

```txt id="f78"
runtime state
  ↓
metadata
  ↓
resolved projections
  ↓
renderer adapters
  ↓
React components
```

---

# Projection Components

Projection components:

* render runtime state
* emit runtime events
* remain controlled
* remain deterministic

---

# WRONG

```tsx id="f79"
useEffect(() => {
  fetchUsers()
}, [])
```

---

# CORRECT

```tsx id="f80"
const runtime =
  useListRuntime('crm.customer')
```

---

# 29. Personalization Runtime

# Responsibilities

* saved views
* layouts
* filters
* themes
* pinned items
* dashboards

---

# Resolution Flow

```txt id="f81"
framework defaults
  ↓
tenant defaults
  ↓
role defaults
  ↓
user preferences
```

---

# 30. Theme Runtime

# Responsibilities

* token resolution
* branding
* dark mode
* white labeling

---

# Rules

Never hardcode:

```txt id="f82"
colors
spacing
typography
```

inside business components.

---

# 31. Devtools Runtime

# Responsibilities

* query inspector
* transaction timeline
* registry inspector
* slot inspector
* dependency graph visualizer
* event timeline
* runtime traces

---

# Trace Example

```ts id="f83"
{
  transactionId,
  patches,
  runtimeEffects,
  duration
}
```

---

# 32. Performance Architecture

# Philosophy

Performance is architectural.

---

# Required Optimizations

* scoped subscriptions
* virtualization
* batching
* render isolation
* lazy loading
* cache reuse
* code splitting

---

# NEVER

```txt id="f84"
full application rerenders
```

---

# 33. Offline Runtime

# Responsibilities

* local persistence
* mutation queues
* optimistic offline state
* reconciliation

---

# Offline Flow

```txt id="f85"
offline mutation
  ↓
local transaction
  ↓
queue persistence
  ↓
reconnect
  ↓
reconciliation
```

---

# 34. Error Isolation

# Rules

One extension failure must NEVER crash runtime.

---

# Isolation Layers

```txt id="f86"
module isolation
extension isolation
renderer isolation
workflow isolation
```

---

# 35. SDK Runtime

# Philosophy

Developers interact through runtime SDK.

---

# SDK APIs

```ts id="f87"
createModule()

createEntity()

createListView()

createForm()

createWorkflow()

registerSlot()

registerWidget()

registerCommand()

registerFieldType()

registerFilterOperator()
```

---

# Feature Creation Lifecycle

```txt id="f88"
developer creates metadata
  ↓
compiler validates metadata
  ↓
registries updated
  ↓
runtime indexes generated
  ↓
extensions resolved
  ↓
queries bound
  ↓
projection rendered
```

---

# 36. Folder Structure

```txt id="f89"
core/
  runtime/
  scheduler/
  registries/
  metadata/
  permissions/
  workflows/
  shell/
  renderer/

features/
  crm/
  shipping/
  inventory/

extensions/

plugins/

adapters/

devtools/
```

---

# 37. Final Result

You end up with:

* frontend operating system
* composable business runtime
* metadata-driven architecture
* reactive graph execution
* tenant-aware infrastructure
* deterministic runtime
* extension-safe platform
* realtime-ready architecture
* workflow-capable frontend
* enterprise-grade scalability
