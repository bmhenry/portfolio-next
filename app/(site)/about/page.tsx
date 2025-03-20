import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="relative w-full rounded-lg overflow-hidden mb-6">
              <Image
                src="/portrait_web_small.jpg"
                alt="Brandon portrait"
                width={500}
                height={0}
                style={{ width: '100%', height: 'auto' }}
                className="object-center"
              />
            </div>

            <h1 className="text-3xl font-bold mb-2">Brandon</h1>
            <p className="text-muted-foreground mb-4">Senior Computer Engineer, Tech Lead, Team Lead, and Supervisor</p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Contact</h3>
                <p className="text-sm">contact@bhenry.dev</p>
                <p className="text-sm">Dayton, OH</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Education</h3>
                <p className="text-sm font-medium">Indiana Purdue Ft. Wayne</p>
                <p className="text-sm text-muted-foreground">BS in Computer Engineering, 2012-2016</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground mb-4">
              Don't expect anyone to redo your work later. Do it the right way, now.
            </p>
            <p className="text-muted-foreground mb-4">
              I believe in building quality software. I enjoy creating tools that improve the lives of users and engineers.
            </p>
            <p className="text-muted-foreground mb-4">
              At home, I like to spend time on personal projects such as FocusFinder and  or self-hosting a variety of services
              such as GitLab and Immich. Apart from tech, I enjoy <a className="text-blue-700 hover:underline" href="/photos">photography</a> (mostly landscapes),
              ultimate frisbee, pickeball, and backpacking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Experience</h2>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Senior Software Engineer</CardTitle>
                    <CardDescription>Tangram Flex - Dayton, OH</CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">2019 - Present</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Created the Verifier tool: a new product & feature that's unique in the market and provides interface-level testing for software components, allowing developers and integrators to test compatible of swappable components</li>
                  <li>Tech lead for teams performing on millions of dollars in contracts, including multidisciplinary and cross-organizational teams</li>
                  <li>Technical advisor & product advisor for both internal and external teams as well as customers</li>
                  <li>Worked with engineers & leadership to build team members' skills and careers while following their interests</li>
                  <li>Collaborated regularly with other product leads and company leadership on product & business direction, such as how to sell Verifier and goal prioritization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Software Engineer</CardTitle>
                    <CardDescription>General Dynamics Mission Systems - Dayton, OH</CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">2017 - 2019</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Brought up a new product board from scratch</li>
                  <li>Created new embedded Linux drivers & adapted existing drivers to link FPGA-based peripherals</li>
                  <li>Developed & adapted FPGA applications</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Skills</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Top Programming Languages</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>C++</Badge>
                  <Badge>Rust</Badge>
                  <Badge>Python</Badge>
                  <Badge>C</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Top Tools & Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Docker</Badge>
                  <Badge>Kubernetes</Badge>
                  <Badge>Git</Badge>
                  <Badge>GitLab</Badge>
                  <Badge>CI/CD</Badge>
                  <Badge>Claude</Badge>
                  <Badge>Cline</Badge>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verifier</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-5">
                    Perform isolated runtime testing on a software component using its model
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline">C++</Badge>
                    <Badge variant="outline">Tangram Pro</Badge>
                    <Badge variant="outline">Docker</Badge>
                    <Badge variant="outline">Kubernetes</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>pkg</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-5">
                    Git-based dependency source management for C++, Flex, and more
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline">Rust</Badge>
                    <Badge variant="outline">Tokio</Badge>
                    <Badge variant="outline">Git</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FocusFinder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-5">
                    Mobile app to help photographers save and return to their favorite spots
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline">Flutter</Badge>
                    <Badge variant="outline">Dart</Badge>
                    <Badge variant="outline">Android</Badge>
                    <Badge variant="outline">iOS</Badge>
                    <Badge variant="outline">LLM</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cross-Domain Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-5">
                    Filter network messages based on user-defined rules and conditions.
                    Delivered in a package the shape of a credit card.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline">C</Badge>
                    <Badge variant="outline">C++</Badge>
                    <Badge variant="outline">Embedded Linux</Badge>
                    <Badge variant="outline">VHDL</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
