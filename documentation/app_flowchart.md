flowchart TD
    A[Start] --> B[Open App]
    B --> C[Check Auth]
    C -->|Not Authenticated| D[Show Login Signup]
    C -->|Authenticated| E[Show Dashboard]
    D -->|Login Successful| E
    D -->|Signup Selected| F[Signup Form]
    F -->|Signup Successful| E
    E --> G[Select or Create Project]
    G -->|Create New| H[New Project Form]
    H -->|Project Created| E
    G -->|Open Project| I[Project Dashboard]
    I --> J[Open Doc Editor]
    J --> K[Fill Input Specs]
    K --> L[Submit to Generate Docs]
    L --> M[Show Loading]
    M --> N[Receive Docs]
    N --> O[Display Generated Docs]
    O --> P[Save or Export Docs]
    P --> I
    O -->|Regenerate Docs| L
    I -->|Back to Projects| E