import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24 sm:px-8">
        <div className="space-y-10">
          <div className="max-w-3xl space-y-5">
            <Badge>shadcn</Badge>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Build with shadcn-style components.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
              A clean landing page powered by Tailwind CSS and reusable UI primitives.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button>Get started</Button>
            <Button variant="outline">View docs</Button>
          </div>

          <div id="features" className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Design system</CardTitle>
                <CardDescription>
                  Consistent tokens, spacing, and accessible elements ready for your app.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built to scale with shadcn-style component patterns and Tailwind CSS utilities.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Reusable UI</CardTitle>
                <CardDescription>Buttons, badges, and cards designed to work together.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use the shared component primitives across pages for a polished UI.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Next.js App Router</CardTitle>
                <CardDescription>Fast static rendering with a modern project setup.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simple, ready-to-run app structure with TypeScript and Tailwind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
