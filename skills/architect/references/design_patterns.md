# Design Patterns Catalog for Next.js

## Creational Patterns

### Factory Pattern
**Use for:** Creating configured instances of services, clients, or adapters.

```typescript
// lib/email/factory.ts
import { ResendAdapter } from './resend';
import { SendgridAdapter } from './sendgrid';
import { DebugEmailAdapter } from './debug';

export function createEmailAdapter() {
  const provider = process.env.EMAIL_PROVIDER;
  
  switch (provider) {
    case 'resend': return new ResendAdapter();
    case 'sendgrid': return new SendgridAdapter();
    default: return new DebugEmailAdapter();
  }
}
```

### Singleton Pattern
**Use for:** Database connections, cache clients, config objects.

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Structural Patterns

### Adapter Pattern
**Use for:** Wrapping external libraries to provide consistent interface.

```typescript
// lib/cache/adapter.ts
interface CachePort {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
}

export class UpstashAdapter implements CachePort { ... }
export class MemoryAdapter implements CachePort { ... }
```

### Decorator Pattern
**Use for:** Adding behavior to components without modifying them.

```typescript
// HOC for analytics tracking
function withTracking<P extends object>(
  Component: React.ComponentType<P>,
  eventName: string
) {
  return function TrackedComponent(props: P) {
    useEffect(() => {
      analytics.track(eventName, props);
    }, []);
    return <Component {...props} />;
  };
}
```

### Composite Pattern
**Use for:** Tree structures like comments, categories, navigation.

```typescript
interface MenuItem {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
}

function Menu({ items }: { items: MenuItem[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
          {item.children && <Menu items={item.children} />}
        </li>
      ))}
    </ul>
  );
}
```

## Behavioral Patterns

### Observer Pattern
**Use for:** Real-time updates, notifications, reactive state.

```typescript
// hooks/useEventSource.ts
export function useEventSource<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  
  useEffect(() => {
    const source = new EventSource(url);
    source.onmessage = (event) => setData(JSON.parse(event.data));
    return () => source.close();
  }, [url]);
  
  return data;
}
```

### Strategy Pattern
**Use for:** Interchangeable algorithms, validation rules, sorting.

```typescript
// lib/search/strategies.ts
type SearchStrategy = (query: string, items: any[]) => any[];

const strategies: Record<string, SearchStrategy> = {
  fuzzy: (q, items) => fuzzySearch(q, items),
  exact: (q, items) => exactSearch(q, items),
  semantic: (q, items) => vectorSearch(q, items),
};

export function search(strategy: string, query: string, items: any[]) {
  return strategies[strategy]?.(query, items) ?? items;
}
```

### Command Pattern
**Use for:** Undo/redo, queued operations, transactional updates.

```typescript
// hooks/useCommandHistory.ts
interface Command {
  execute(): void;
  undo(): void;
}

export function useCommandHistory() {
  const [history, setHistory] = useState<Command[]>([]);
  const [index, setIndex] = useState(-1);
  
  const execute = (command: Command) => {
    command.execute();
    setHistory(prev => [...prev.slice(0, index + 1), command]);
    setIndex(prev => prev + 1);
  };
  
  const undo = () => {
    if (index >= 0) {
      history[index].undo();
      setIndex(prev => prev - 1);
    }
  };
  
  return { execute, undo, canUndo: index >= 0 };
}
```

### Template Method Pattern
**Use for:** Common algorithm with variant steps.

```typescript
// lib/api/base-route.ts
abstract class ApiRoute<T> {
  async handle(req: NextRequest): Promise<NextResponse> {
    try {
      await this.validate(req);
      const data = await this.process(req);
      return NextResponse.json({ success: true, data });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  abstract validate(req: NextRequest): Promise<void>;
  abstract process(req: NextRequest): Promise<T>;
  abstract handleError(error: unknown): NextResponse;
}
```

## React-Specific Patterns

### Compound Components
Components that work together to form a complete UI.

```typescript
// components/ui/Tabs.tsx
const TabsContext = createContext<{ activeTab: string; setActiveTab: (id: string) => void } | null>(null);

export function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.List = function TabList({ children }: { children: React.ReactNode }) {
  return <div role="tablist" className="flex gap-2">{children}</div>;
};

Tabs.Trigger = function TabTrigger({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={ctx?.activeTab === id}
      onClick={() => ctx?.setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.Content = function TabContent({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext);
  if (ctx?.activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
};
```

### Provider Pattern
Encapsulate state and logic, expose via context.

```typescript
// contexts/NotificationContext.tsx
interface NotificationContextType {
  notifications: Notification[];
  add: (notification: Omit<Notification, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const add = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);
  
  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const value = useMemo(() => ({ notifications, add, remove, clear: () => setNotifications([]) }), 
    [notifications, add, remove]);
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
```

### Render Props / Slot Pattern
Delegate rendering to parent for maximum flexibility.

```typescript
// components/ui/DataTable.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderRow?: (item: T, index: number) => React.ReactNode;
}
```

### Custom Hooks as Services
Encapsulate business logic in hooks, not components.

```typescript
// hooks/useRSVP.ts
export function useRSVP(eventId: string) {
  const queryClient = useQueryClient();
  const { data: rsvp } = useQuery({ queryKey: ['rsvp', eventId], ... });
  
  const { mutate: rsvpToEvent } = useMutation({
    mutationFn: (status: RSVPStatus) => api.post(`/events/${eventId}/rsvp`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvp', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });
  
  return { rsvp, rsvpToEvent, isLoading };
}
```
