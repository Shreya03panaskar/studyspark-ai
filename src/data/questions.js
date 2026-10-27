/**
 * StudySpark Curated Subject & Question Bank
 * Verified, high-yield college sample questions with accurate technical explanations.
 * Label: Curated sample questions for college students (No mock/fake AI claims).
 */

export const SUBJECTS = [
  {
    id: 'java',
    name: 'Java Programming',
    category: 'Software Engineering',
    colorKey: 'java',
    description: 'Object-oriented fundamentals, JVM execution, memory management, and core syntax.',
    topics: ['OOP Principles', 'Syntax & Types', 'Exception Handling', 'Collections', 'Memory & Keywords']
  },
  {
    id: 'htmlcss',
    name: 'HTML & CSS',
    category: 'Web Development',
    colorKey: 'htmlcss',
    description: 'Modern semantic structure, CSS box model, responsive layouts, Flexbox, and Grid.',
    topics: ['Semantic HTML', 'CSS Box Model', 'Flexbox & Grid', 'Selectors & Specificity', 'Accessibility']
  },
  {
    id: 'networks',
    name: 'Computer Networks',
    category: 'Systems & Infrastructure',
    colorKey: 'networks',
    description: 'Layered architectures (OSI & TCP/IP), addressing, transport protocols, and routing.',
    topics: ['OSI Model', 'TCP vs UDP', 'IP Addressing & Subnets', 'DNS & HTTP/S', 'Link Layer & ARP']
  }
];

export const QUESTION_BANK = [
  // ================= JAVA PROGRAMMING (6 Questions) =================
  {
    id: 'java-1',
    subjectId: 'java',
    topic: 'OOP Principles',
    question: 'In Java, which keyword is used by a subclass to explicitly invoke a constructor of its parent class?',
    codeSnippet: null,
    options: [
      'this()',
      'super()',
      'parent()',
      'extends()'
    ],
    correctIndex: 1,
    explanation: 'super() is used in Java to call the constructor of the direct superclass. When used, it must be the very first statement inside the subclass constructor. this() calls another constructor within the same class.'
  },
  {
    id: 'java-2',
    subjectId: 'java',
    topic: 'Memory & Keywords',
    question: 'What happens when a variable is declared with the "static" keyword in Java?',
    codeSnippet: 'public class Student {\n    static int schoolCode = 101;\n}',
    options: [
      'Each new instance of Student receives its own isolated copy of schoolCode in heap memory.',
      'The variable belongs to the class itself and is shared among all instances, stored in the Metaspace/Class area.',
      'The variable becomes immutable and cannot be updated once initialized.',
      'The variable can only be accessed by private methods within the same file.'
    ],
    correctIndex: 1,
    explanation: 'Static variables belong to the class rather than individual instances. There is only one copy of schoolCode in memory shared across all instances of the Student class.'
  },
  {
    id: 'java-3',
    subjectId: 'java',
    topic: 'Syntax & Types',
    question: 'What is the output of comparing two String objects using the == operator versus the .equals() method in Java?',
    codeSnippet: 'String s1 = new String("Java");\nString s2 = new String("Java");\nSystem.out.println((s1 == s2) + " " + s1.equals(s2));',
    options: [
      'true true',
      'false false',
      'false true',
      'true false'
    ],
    correctIndex: 2,
    explanation: 'The == operator compares memory references (addresses). Because s1 and s2 were created with "new String()", they occupy different heap objects, so s1 == s2 is false. The .equals() method compares the character sequence, which is identical, so it returns true.'
  },
  {
    id: 'java-4',
    subjectId: 'java',
    topic: 'Exception Handling',
    question: 'Under what condition will code inside a "finally" block NOT execute in Java?',
    codeSnippet: null,
    options: [
      'When an unchecked NullPointerException occurs inside the try block.',
      'When a return statement is encountered inside the catch block.',
      'When System.exit(0) is executed before reaching or inside the try-catch block.',
      'When the try block finishes execution without throwing any exceptions.'
    ],
    correctIndex: 2,
    explanation: 'The finally block is guaranteed to run even if a return or exception occurs, EXCEPT when the JVM is terminated abruptly, such as by calling System.exit(0) or encountering a fatal JVM crash (e.g., OutOfMemoryError).'
  },
  {
    id: 'java-5',
    subjectId: 'java',
    topic: 'Collections',
    question: 'Which of the following Java collections guarantees constant-time O(1) average lookup performance by key, but does NOT maintain insertion order?',
    codeSnippet: null,
    options: [
      'ArrayList',
      'TreeMap',
      'HashMap',
      'LinkedHashMap'
    ],
    correctIndex: 2,
    explanation: 'HashMap provides O(1) average-time performance for get() and put() using hash buckets, but makes no guarantee regarding iteration order. LinkedHashMap preserves insertion order, and TreeMap orders keys based on natural sorting (O(log n)).'
  },
  {
    id: 'java-6',
    subjectId: 'java',
    topic: 'OOP Principles',
    question: 'Which rule correctly applies to Method Overriding in Java?',
    codeSnippet: null,
    options: [
      'The overriding method in the child class can have a more restrictive access modifier than the parent method.',
      'The overriding method must have the exact same method signature (name and parameter list) and a compatible return type.',
      'Static methods can be overridden by instance methods in subclasses.',
      'Private methods can be overridden as long as the @Override annotation is provided.'
    ],
    correctIndex: 1,
    explanation: 'Method overriding requires the same method name, identical parameter types/order, and a compatible (covariant) return type. Overriding methods cannot assign weaker access privileges (e.g., protected cannot be made private) and static methods cannot be overridden (they are hidden).'
  },

  // ================= HTML & CSS (6 Questions) =================
  {
    id: 'html-1',
    subjectId: 'htmlcss',
    topic: 'CSS Box Model',
    question: 'If a div has "width: 200px; padding: 20px; border: 5px solid black; box-sizing: border-box;", what is its total rendered outer width?',
    codeSnippet: '.box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}',
    options: [
      '250px',
      '200px',
      '240px',
      '150px'
    ],
    correctIndex: 1,
    explanation: 'With "box-sizing: border-box", the declared width (200px) encompasses the content, padding, and border. The browser automatically contracts the content area so the total outer rendered width remains exactly 200px.'
  },
  {
    id: 'html-2',
    subjectId: 'htmlcss',
    topic: 'Semantic HTML',
    question: 'Which HTML5 semantic element is most appropriate for self-contained, independently distributable content like a blog post, forum topic, or news article?',
    codeSnippet: null,
    options: [
      '<section>',
      '<article>',
      '<aside>',
      '<main>'
    ],
    correctIndex: 1,
    explanation: 'The <article> tag is specifically designed for independent, self-contained syndicatable content that makes complete sense on its own. The <section> tag is for thematic groupings of content, and <aside> is for tangentially related sidebars.'
  },
  {
    id: 'html-3',
    subjectId: 'htmlcss',
    topic: 'Flexbox & Grid',
    question: 'In a Flexbox container with "flex-direction: row", which property aligns flex items along the cross axis (vertical direction)?',
    codeSnippet: '.container {\n  display: flex;\n  flex-direction: row;\n  /* Which property controls vertical cross-axis alignment? */\n}',
    options: [
      'justify-content',
      'align-items',
      'align-content',
      'flex-basis'
    ],
    correctIndex: 1,
    explanation: 'In flex-direction: row, the main axis is horizontal and controlled by justify-content. The cross axis is vertical and controlled by align-items (or align-self on individual items).'
  },
  {
    id: 'html-4',
    subjectId: 'htmlcss',
    topic: 'Selectors & Specificity',
    question: 'Between the following CSS selectors applied to the same element, which one has the highest specificity weight?',
    codeSnippet: null,
    options: [
      'div.card span.highlight (Two elements + two classes = 0,0,2,2)',
      '#main-nav li a (One ID + two elements = 0,1,0,2)',
      'header ul.menu li:hover (One element + one class + one pseudo-class = 0,0,2,3)',
      '.container .row .col (Three classes = 0,0,3,0)'
    ],
    correctIndex: 1,
    explanation: 'CSS specificity is calculated as (Inline, ID, Class/Attribute/Pseudo-class, Element). An ID selector has a value in the second column (0,1,0,2), which beats any number of classes or elements lacking an ID.'
  },
  {
    id: 'html-5',
    subjectId: 'htmlcss',
    topic: 'Accessibility',
    question: 'How should an accessible HTML text input be programmatically associated with its visible label?',
    codeSnippet: '<label ...>Student Email</label>\n<input type="email" ... />',
    options: [
      'Set the label class to match the input name attribute.',
      'Set the label "for" attribute to match the input "id" attribute.',
      'Place both tags inside a <div> with role="form-control".',
      'Add an aria-label attribute to the label tag.'
    ],
    correctIndex: 1,
    explanation: 'Matching the <label for="email-field"> attribute to the <input id="email-field"> programmatically binds them. Screen readers announce the label upon focus, and clicking the label focuses the input.'
  },
  {
    id: 'html-6',
    subjectId: 'htmlcss',
    topic: 'Selectors & Specificity',
    question: 'What is the key difference between the CSS units "rem" and "em"?',
    codeSnippet: null,
    options: [
      '"rem" is relative to the root (<html>) font size, while "em" is relative to the font size of its parent element.',
      '"rem" only works for padding and margins, whereas "em" only works for font-size.',
      '"em" is fixed across all screens, whereas "rem" adapts to screen DPI.',
      '"rem" is relative to the viewport height, while "em" is relative to the viewport width.'
    ],
    correctIndex: 0,
    explanation: '"rem" stands for "root em" and scales relative to the root <html> element (usually 16px by default). "em" is compounding and scales relative to the immediate parent element\'s font size.'
  },

  // ================= COMPUTER NETWORKS (6 Questions) =================
  {
    id: 'net-1',
    subjectId: 'networks',
    topic: 'OSI Model',
    question: 'At which OSI model layer do routers primarily operate to make path-forwarding decisions based on logical IP addresses?',
    codeSnippet: null,
    options: [
      'Layer 2 (Data Link Layer)',
      'Layer 3 (Network Layer)',
      'Layer 4 (Transport Layer)',
      'Layer 7 (Application Layer)'
    ],
    correctIndex: 1,
    explanation: 'Routers operate at Layer 3 (Network Layer). They inspect source and destination IP addresses in packet headers and use routing tables to determine the best next-hop interface.'
  },
  {
    id: 'net-2',
    subjectId: 'networks',
    topic: 'TCP vs UDP',
    question: 'Why is UDP (User Datagram Protocol) preferred over TCP for real-time multiplayer video gaming and live voice streaming?',
    codeSnippet: null,
    options: [
      'UDP guarantees 100% in-order delivery and packet encryption by default.',
      'UDP has no three-way connection handshake, no flow-control delays, and does not retransmit lost packets.',
      'UDP packets automatically bypass network firewalls and Network Address Translation (NAT).',
      'UDP utilizes larger packet headers to store audio-video checksums.'
    ],
    correctIndex: 1,
    explanation: 'UDP is a lightweight, connectionless protocol with minimal header overhead (8 bytes vs 20+ bytes). It trades reliability (no retransmission or ordering) for low latency, which is essential for real-time voice and video where a late packet is useless.'
  },
  {
    id: 'net-3',
    subjectId: 'networks',
    topic: 'IP Addressing & Subnets',
    question: 'Which of the following IP addresses belongs to an RFC 1918 Private IPv4 address range, reserved exclusively for local internal networks?',
    codeSnippet: null,
    options: [
      '8.8.8.8',
      '172.20.14.5',
      '198.51.100.22',
      '128.0.0.1'
    ],
    correctIndex: 1,
    explanation: 'RFC 1918 defines three private address spaces: 10.0.0.0/8, 172.16.0.0/12 (which spans 172.16.0.0 to 172.31.255.255), and 192.168.0.0/16. 172.20.14.5 falls squarely within the 172.16.0.0/12 range.'
  },
  {
    id: 'net-4',
    subjectId: 'networks',
    topic: 'DNS & HTTP/S',
    question: 'What is the primary function of the Domain Name System (DNS) in computer networking?',
    codeSnippet: null,
    options: [
      'Assigning dynamic IP addresses to client devices joining a local Wi-Fi router via DHCP.',
      'Translating human-friendly domain names (e.g., example.edu) into machine-routable IP addresses.',
      'Encrypting HTTP payloads using public key certificates and TLS session keys.',
      'Filtering malicious packets at the network boundary using stateful firewall inspection.'
    ],
    correctIndex: 1,
    explanation: 'DNS serves as the internet\'s directory by translating human-readable hostnames (such as "college.edu") into numerical IP addresses (such as "93.184.216.34") required by routers to route packets.'
  },
  {
    id: 'net-5',
    subjectId: 'networks',
    topic: 'TCP vs UDP',
    question: 'What sequence of packet flags constitutes the standard TCP Three-Way Handshake used to establish a reliable connection?',
    codeSnippet: null,
    options: [
      'SYN → SYN-ACK → ACK',
      'ACK → SYN → ACK-SYN',
      'FIN → FIN-ACK → ACK',
      'RST → SYN → ACK'
    ],
    correctIndex: 0,
    explanation: 'The TCP connection setup sequence is: 1) Client sends SYN (synchronize sequence numbers), 2) Server responds with SYN-ACK (synchronize and acknowledge), 3) Client replies with ACK (acknowledge). Once complete, data transfer begins.'
  },
  {
    id: 'net-6',
    subjectId: 'networks',
    topic: 'Link Layer & ARP',
    question: 'What is the purpose of the Address Resolution Protocol (ARP) within a local area network (LAN)?',
    codeSnippet: null,
    options: [
      'To discover the external public IP address assigned by an Internet Service Provider (ISP).',
      'To map a known Layer 3 logical IP address to a physical Layer 2 MAC address on the local link.',
      'To encrypt physical Ethernet frames before wireless radio broadcast.',
      'To prevent broadcast loops across redundant network switch topologies.'
    ],
    correctIndex: 1,
    explanation: 'When a host knows the destination IP address on the local subnet but lacks the physical hardware destination, it broadcasts an ARP request to resolve that IP into the corresponding 48-bit MAC address for Ethernet framing.'
  }
];

export function getSubjectById(subjectId) {
  return SUBJECTS.find(s => s.id === subjectId) || null;
}

export function getQuestionsBySubject(subjectId) {
  return QUESTION_BANK.filter(q => q.subjectId === subjectId);
}

export function getQuestionById(questionId) {
  return QUESTION_BANK.find(q => q.id === questionId) || null;
}

