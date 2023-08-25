import { VStack, Input, Heading, InputGroup, InputLeftAddon, Spacer } from '@chakra-ui/react'
import { Organization } from './types/organization'

type CyclesInputProps = {
  title: string
  organization: Organization
  setOrganization: (organization: Organization) => void
}

export const CyclesInput: React.FC<CyclesInputProps> = ({title, organization, setOrganization}) => {
  

  return (
    <VStack py={6} px={10} borderWidth={'1px'} borderRadius={'md'} boxShadow={'md'}>
      <Heading as={'h2'}>{title}</Heading>
      <InputGroup>
        <InputLeftAddon fontFamily={'monospace'} children="Formato U" />
        <Input
          value={organization.cycles.U}
          type={'number'}
          min={0}
          onChange={(e) => setOrganization({...organization, cycles: {...organization.cycles, U: e.target.value as unknown as number}})}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon fontFamily={'monospace'} children="Formato J" />
        <Input
          value={organization.cycles.J}
          type={'number'}
          min={0}
          onChange={(e) => setOrganization({...organization, cycles: {...organization.cycles, J: e.target.value as unknown as number}})}

        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon fontFamily={'monospace'} children="Formato I" />
        <Input
          value={organization.cycles.I}
          type={'number'}
          min={0}
          onChange={(e) => setOrganization({...organization, cycles: {...organization.cycles, I: e.target.value as unknown as number}})}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon fontFamily={'monospace'} children="Formato B" />
        <Input
          value={organization.cycles.B}
          type={'number'}
          min={0}
          onChange={(e) => setOrganization({...organization, cycles: {...organization.cycles, B: e.target.value as unknown as number}})}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon fontFamily={'monospace'} children="Formato S" />
        <Input
          value={organization.cycles.S}
          type={'number'}
          min={0}
          onChange={(e) => setOrganization({...organization, cycles: {...organization.cycles, S: e.target.value as unknown as number}})}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon fontFamily={'monospace'} children="Formato R" />
        <Input
          value={organization.cycles.R}
          type={'number'}
          min={0}
          onChange={(e) => setOrganization({...organization, cycles: {...organization.cycles, R: e.target.value as unknown as number}})}
        />
      </InputGroup>
      <Spacer pt={4}/>
      <InputGroup>
        <InputLeftAddon fontFamily={'monospace'} children="Clock" />
        <Input 
          value={organization.clock} 
          type={'number'}
          min={0} 
          onChange={(e) => setOrganization({...organization, clock: e.target.value as unknown as number})}
        />
      </InputGroup>
    </VStack>
  )
}