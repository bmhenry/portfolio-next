import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-6">
              <Image
                src="/portrait_web_small.jpg"
                alt="Brandon portrait"
                fill
                className="object-cover object-center"
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
              I'm a software engineer with a passion for building elegant, user-friendly applications. With over 8 years
              of experience in full-stack development, I specialize in React, Node.js, and cloud architecture. When I'm
              not coding, you can find me exploring the world with my camera, hiking in remote locations, or writing
              about technology on my blog.
            </p>
            <p className="text-muted-foreground">
              My approach combines technical expertise with creative problem-solving, allowing me to build solutions
              that are both technically sound and aesthetically pleasing. I believe in continuous learning and staying
              at the forefront of technological advancements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Experience</h2>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Senior Software Engineer</CardTitle>
                    <CardDescription>Google, Mountain View</CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">2020 - Present</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Led the development of a new feature that increased user engagement by 35%</li>
                  <li>Architected and implemented a microservices infrastructure using Kubernetes</li>
                  <li>Mentored junior engineers and conducted technical interviews</li>
                  <li>Collaborated with product and design teams to refine user experiences</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Software Engineer</CardTitle>
                    <CardDescription>Facebook, Menlo Park</CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">2018 - 2020</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Developed and maintained React components for the main Facebook app</li>
                  <li>Improved application performance by 25% through code optimization</li>
                  <li>Implemented automated testing strategies that reduced bugs by 40%</li>
                  <li>Contributed to open-source projects within the company</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Software Engineering Intern</CardTitle>
                    <CardDescription>Microsoft, Redmond</CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">Summer 2017</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Worked on the Azure team to develop cloud infrastructure tools</li>
                  <li>Created a dashboard for monitoring system performance</li>
                  <li>Participated in agile development processes and sprint planning</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Skills</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Programming Languages</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>JavaScript</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Python</Badge>
                  <Badge>Go</Badge>
                  <Badge>Java</Badge>
                  <Badge>C++</Badge>
                  <Badge>SQL</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Frameworks & Libraries</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>React</Badge>
                  <Badge>Next.js</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>Express</Badge>
                  <Badge>Django</Badge>
                  <Badge>TensorFlow</Badge>
                  <Badge>Redux</Badge>
                  <Badge>GraphQL</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tools & Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>AWS</Badge>
                  <Badge>Google Cloud</Badge>
                  <Badge>Docker</Badge>
                  <Badge>Kubernetes</Badge>
                  <Badge>Git</Badge>
                  <Badge>CI/CD</Badge>
                  <Badge>Jira</Badge>
                  <Badge>Figma</Badge>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Home Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    A full-stack application for controlling smart home devices using React, Node.js, and MQTT.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">IoT</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Image Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    A machine learning model that identifies objects in photographs with 95% accuracy.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">TensorFlow</Badge>
                    <Badge variant="outline">Computer Vision</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>E-commerce Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    A scalable online store built with Next.js, Stripe, and a headless CMS.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Next.js</Badge>
                    <Badge variant="outline">Stripe</Badge>
                    <Badge variant="outline">Contentful</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Travel Journal App</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    A mobile application for documenting travels with photos, notes, and location tracking.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">React Native</Badge>
                    <Badge variant="outline">Firebase</Badge>
                    <Badge variant="outline">Maps API</Badge>
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

