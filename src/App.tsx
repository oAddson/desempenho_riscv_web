import React, { useEffect, useState } from 'react'
import { Box, Flex, Grid, HStack, Heading, Input, Select, Text, VStack, TableContainer, Table, Thead, Th, Tbody, Td, Tr} from '@chakra-ui/react'
import { CyclesInput } from './cycles-input'
import { Organization } from './types/organization';

const isBinaryString = (str: string) => {
  return /^[01]+$/.test(str);
}

type instructionCount = {
  U: number
  J: number
  I: number
  B: number
  S: number
  R: number
}

type Program = {
  name: string
  instructions: Array<string>
  instructionCount: instructionCount
  bestPerformance?: string
  performanceDifference?: number
  executionTimeA?: number
  executionTimeB?: number
  totalCyclesA?: number
  totalCyclesB?: number
  averageCPIA?: number
  averageCPIB?: number
}
const initialStateOrganization = {
  clock: 1,
  cycles: {
    U: 1,
    J: 1,
    I: 1,
    B: 1,
    S: 1,
    R: 1,
  }
}

const opcodes = {
  U: ['0110111', '0010111'],
  J: ['1101111'],
  I: ['1100111', '0000011', '0010011', '0001111', '1110011'],
  B: ['1100011'],
  S: ['0100011'],
  R: ['0110011']
}

function App() {
  const [organizationA, setOrganizationA] = useState<Organization>(initialStateOrganization)
  const [organizationB, setOrganizationB] = useState<Organization>(initialStateOrganization)
  const [programs, setPrograms] = useState<Array<Program>>([])

  const instructionCounter = (instructions: Array<string>) => {
    const instructionCount = {
      U: 0,
      J: 0,
      I: 0,
      B: 0,
      S: 0,
      R: 0
    }
    instructions.forEach((instruction: string) => {
      const opcode = instruction.slice(instruction.length - 7, instruction.length)
      if (opcodes.U.includes(opcode)) {
        instructionCount.U++
      } else if (opcodes.J.includes(opcode)) {
        instructionCount.J++
      } else if (opcodes.I.includes(opcode)) {
        instructionCount.I++
      } else if (opcodes.B.includes(opcode)) {
        instructionCount.B++
      } else if (opcodes.S.includes(opcode)) {
        instructionCount.S++
      } else if (opcodes.R.includes(opcode)) {
        instructionCount.R++
      }
    })
    return instructionCount
  }

  useEffect(() => {
    setPrograms(programs => programs.map((program: Program) :Program => {
      const totalCyclesA = totalCycles(program.instructionCount, organizationA)
      const totalCyclesB = totalCycles(program.instructionCount, organizationB)
      const averageCPIA = totalCyclesA / program.instructions.length
      const averageCPIB = totalCyclesB / program.instructions.length
      const executionTimeA = totalCyclesA * organizationA.clock
      const executionTimeB = totalCyclesB * organizationB.clock
      const bestPerformance = executionTimeA < executionTimeB ? 'Organização A' : 'Organização B'
      const performanceDifference = executionTimeA < executionTimeB ? executionTimeB / executionTimeA : executionTimeA / executionTimeB
      return {...program, totalCyclesA, totalCyclesB, averageCPIA, averageCPIB, executionTimeA, executionTimeB, bestPerformance, performanceDifference}
    }))

  }, [organizationA, organizationB, programs.length])

  const totalCycles = (instructionCount: instructionCount, organization: Organization) => {
    
    return instructionCount.U * organization.cycles.U + instructionCount.J * organization.cycles.J + instructionCount.I * organization.cycles.I + instructionCount.B * organization.cycles.B + instructionCount.S * organization.cycles.S + instructionCount.R * organization.cycles.R
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        const lines: Array<string> = fileContent?.split('\n') || []
        const normalizedLines = lines.map((line: string) => line.replace('\r', ''))
        const instructions = normalizedLines.filter((line: string) => line.length === 32 && isBinaryString(line))
        setPrograms(programs => [...programs, {name: file.name, instructions, instructionCount: instructionCounter(instructions)}])

      }

      reader.readAsText(file);
    }
  }  

  console.log('aoba');

  return (
    <VStack py={14} px={8} gap={10}>
      <Heading as={'h1'} my={'-8'}>Desempenho</Heading>
      <Flex w={'full'}>
        <Grid gridTemplateColumns={'repeat(3, minmax(0, 1fr))'} w={'full'} gap={12}>
          <CyclesInput title={"Organização A"} organization={organizationA} setOrganization={setOrganizationA} />
          <CyclesInput title={"Organização B"} organization={organizationB} setOrganization={setOrganizationB} />
          <VStack py={6} px={10} borderWidth={'1px'} borderRadius={'md'} boxShadow={'md'}>
            <Heading as={'h2'}>Arquivo</Heading>
            <Select placeholder="Selecione o tipo de arquivo">
              <option value="bin">Binario</option>
              <option disabled value="hexa">Hexadecimal</option>
            </Select>
            <Grid placeItems={'center'} w={'full'} h={'full'}>
              <Input p={1} onInput={(e: React.ChangeEvent<HTMLInputElement>)=> handleFileChange(e)} type={'file'} />
              <Flex h={'full'} w={'full'} px={4} borderWidth={'1px'} borderRadius={'md'}>
              <TableContainer w={'full'}>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th>Nome</Th>
                      <Th isNumeric>Instruções</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {programs.map((program: Program, i: number) => (
                      <Tr key={`${program?.name}-${i}`}>
                        <Td isTruncated>{program?.name}</Td>
                        <Td isNumeric>{program?.instructions?.length}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              </Flex>
            </Grid>
          </VStack>
        </Grid>
      </Flex>
      {programs.length > 0 && <VStack
        alignItems={'flex-start'}
        w={'full'}
        h={'full'}
        borderWidth={'1px'}
        borderRadius={'md'}
        boxShadow={'md'}
        py={6}
        px={10}
      >
        <Box>
          <Heading>Resultados</Heading>
        </Box>
        {
          programs.map((program: Program, i: number) => (
            <VStack w={'full'} borderWidth={'1px'} alignItems={'flex-start'} py={3} px={5} borderRadius={'md'} key={`${i}${program.name}`}>
              <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'} w={'full'}>
                <Heading as={'h3'} fontSize={'xl'}>{program.name}</Heading>
              </HStack>
              <HStack w={'full'}>
                <VStack alignItems={'flex-start'} flex={'1 0'} bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'} >               
                  <Text fontSize={'lg'} fontWeight={'bold'}>Organização A</Text>
                  <HStack>
                    <Text fontWeight={'semibold'}>CPI médio:</Text>
                    <Text>{program.averageCPIA?.toFixed(2)}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight={'semibold'}>Número total de ciclos:</Text>
                    <Text>{program.totalCyclesA}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight={'semibold'}>Tempo de execução:</Text>
                    <Text>{program.executionTimeA?.toFixed(2)}</Text>
                  </HStack>
                </VStack>
                <VStack alignItems={'flex-start'} flex={'1 0'} bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontSize={'lg'} fontWeight={'bold'}>Organização B</Text>
                  <HStack>
                    <Text fontWeight={'semibold'}>CPI médio:</Text>
                    <Text>{program.averageCPIB?.toFixed(2)}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight={'semibold'}>Número total de ciclos:</Text>
                    <Text>{program.totalCyclesB}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight={'semibold'}>Tempo de execução:</Text>
                    <Text>{program.executionTimeB?.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </HStack>
              <HStack>
              <HStack alignItems={'flex-start'}>
                <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontSize={'sm'} fontWeight={'semibold'}>Formato U:</Text>
                  <Text fontSize={'sm'}>{program.instructionCount?.U}</Text>
                </HStack>
                <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontSize={'sm'} fontWeight={'semibold'}>Formato J:</Text>
                  <Text fontSize={'sm'}>{program.instructionCount?.J}</Text>
                </HStack>
                <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontSize={'sm'} fontWeight={'semibold'}>Formato I:</Text>
                  <Text fontSize={'sm'}>{program.instructionCount?.I}</Text>
                </HStack>
                <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontSize={'sm'} fontWeight={'semibold'}>Formato B:</Text>
                  <Text fontSize={'sm'}>{program.instructionCount?.B}</Text>
                </HStack>
                <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontSize={'sm'} fontWeight={'semibold'}>Formato S:</Text>
                  <Text fontSize={'sm'}>{program.instructionCount?.S}</Text>
                </HStack>
                <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontSize={'sm'} fontWeight={'semibold'}>Formato R:</Text>
                  <Text fontSize={'sm'}>{program.instructionCount?.R}</Text>
                </HStack>
              </HStack>
                <HStack bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontWeight={'semibold'}>Número total de instruções:</Text>
                  <Text>{program.instructions.length}</Text>
                </HStack>
                <HStack w={''} bgColor={'gray.50'} p={4} borderRadius={'md'} borderWidth={'1px'} borderColor={'gray.100'}>
                  <Text fontWeight={'bold'}>Melhor desempenho:</Text>
                  {
                    program?.bestPerformance === '1'
                      ? <Text>Mesmo desempenho</Text> :
                      <>
                        <Text>{program.bestPerformance}</Text>
                        <Text fontWeight={'bold'}>{program.performanceDifference?.toFixed(3)}x</Text>
                      </>
                  }
                </HStack>
              </HStack>
            </VStack>   
          ))
        }        
      </VStack>}

    </VStack>
  )
}

export default App
