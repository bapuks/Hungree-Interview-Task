# Hungree-Interview-Task
Interview task for experienced Full Stack Javascript applicants in order to join Hungree

# Libraries Used for Project
@reach/router - URL routing

Typescript - Type checking and preventive bug-fixing

UI
styled-components - React Styled Components styled-icons - Icons as Styled Components react-modal - A Modal Component that is easy to configure

react-tooltip - Tooltips displayed on hover

Data
firebase - The Javascript Firebase SDK

react-firebase-hooks - Easy hooks for authentication

redux / react-redux / redux-thunk / reselect - Redux and friends

immer - Immutability made easy!

store - Cross-Platform local storage

# Error Notes

1. Cannot find module 'store' or its corresponding type declarations.  TS2307
   solution --> npm i -D @types/store
   
2. JSX fragment is not supported when using an inline JSX factory pragma  TS17017    
   example: > 179 |     <>
   solution --> add this <React.Fragment> ... </React.Fragment> to change <>
   
3. Cannot find module 'react-datepicker' or its corresponding type declarations.  TS2307
   solution --> npm i -D @types/react-datepicker

4. Argument of type 'number' is not assignable to parameter of type 'SetStateAction<undefined>'.   TS2345   
   example: > 74 |     setCustomer(current.customerID);
   solution --> const [customer, setCustomer] = useState("customer" as any);
   
5. Could not find a declaration file for module 'react-modal'
   solution --> const [customer, setCustomer] = useState(null);