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
            <p className="text-muted-foreground">Senior Computer Engineer</p>
            <p className="text-muted-foreground">Tech Lead</p>
            <p className="text-muted-foreground">Team Lead</p>
            <p className="text-muted-foreground">Supervisor</p>

            <div className="space-y-4 mt-8">
              <div>
                <h3 className="font-medium mb-2">Company</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  <a href="https://tangramflex.com/" target="_blank" rel="noopener noreferrer">Tangram Flex</a>
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Education</h3>
                <p className="text-sm font-medium">
                  <a href="https://www.pfw.edu/" target="_blank" rel="noopener noreferrer">Indiana Purdue Fort Wayne</a>
                </p>
                <p className="text-sm text-muted-foreground">BS in Computer Engineering, 2012-2016</p>
                <p className="text-sm text-muted-foreground">Chapman Scholar</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground mb-4">
              I'm happiest when I'm making things that help other people. Whether it's a brand new
              product to fill a gap in the market, a mobile app that fills a niche need that isn't being met, or
              just creating a new library that makes my teammates' lives easier, I love to design and
              build answers to life's questions.
            </p>
            <p className="text-muted-foreground mb-4">
              I <b>strongly</b> believe in doing things right the first time. I don't expect anybody
              to come behind me and clean up my mistakes later - I try my hardest to do it right the
              first time. I make plenty of mistakes and do my best to learn from them, but that doesn't
              stop me from trying to put the best first iteration forward, every time.
            </p>
            <p className="text-muted-foreground mb-4">
              I believe in building secure, reliable, and maintainable software -- these three factors
              sum up "code quality" for me.
            </p>
            <ol className="list-decimal text-muted-foreground mb-4 pl-8">
              <li>
                Apps should be written to avoid bugs & memory leaks that may be detrimental to users.
              </li>
              <li>
                They should perform as expected every time to avoid frustrating users. If they don't,
                that's a bug: see rule 1.
              </li>
              <li>
                An app that isn't maintainable is a ticking time bomb, waiting to break rules 1 and 2.
                Write quality comments that explain intent, don't get caught up on a "code is documentation" mantra that harms
                team members (especially newer ones). Write useful tests that allow you to refactor with confidence.
                Keep code clear, organized, and simple.
              </li>
            </ol>
            <p className="text-muted-foreground mb-4">
              At home, I like to spend time on personal projects such as FocusFinder, electronics projects, and self-hosting a variety of services
              such as GitLab and Immich. Apart from tech, I enjoy <a className="text-blue-700 hover:underline" href="/photos">photography</a> (mostly landscapes),
              ultimate frisbee, pickleball, and backpacking.
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
                  <li>Created Runway, the engine behind <a className="text-blue-700 hover:underline" href="https://tangramflex.com/capabilities" target="_blank" rel="noopener noreferrer">Verifier</a>: a new product & feature that's unique in the market. It provides interface-level testing for software components, allowing developers and integrators to test compatibility of swappable components at runtime.</li>
                  <li>Tech lead for many project teams performing on contracts, doing everything from security and testing to code generation and containerization</li>
                  <li>Technical advisor & product advisor for both internal & external teams, as well as for customers</li>
                  <li>Actively collaborate with peers & leadership to "level up" the team, looking for skill & career development opportunities as well as team culture improvements</li>
                  <li>Collaborate regularly with other product leads and company leadership on product direction, such as cross-team product initiatives, how to sell Verifier, and technical milestone prioritization</li>
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
                <h3 className="font-medium mb-2">Favorite Programming Languages</h3>
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
                    Git-based dependency management for C++, Flex, and more
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
                    Breaks the mold for cross-domain solutions with its credit card
                    footprint. Filters network messages
                    based on user-defined rules and conditions.
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
